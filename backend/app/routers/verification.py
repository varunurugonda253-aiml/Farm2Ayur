from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.batch import Batch, BatchEvent
from app.models.herb import Herb
from app.models.ai_scan import AIScanRecord
from app.models.verification import VerificationRecord
from app.schemas.verification import VerificationCreate, VerificationResponse
from app.utils.auth import get_current_user, require_roles

router = APIRouter(prefix="/verification", tags=["Verification"])


def _to_response(row: VerificationRecord) -> dict:
    data = VerificationResponse.model_validate(row).model_dump()
    data["verifier_name"] = row.verifier.full_name if row.verifier else None
    return data

@router.post(
    "/",
    response_model=VerificationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a verification decision (verifier/admin)"
)
def create_verification(
    payload: VerificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("verifier", "admin")),
):
    batch_id = None
    herb_id = None
    ai_scan_id = None

    if payload.target_type == "batch":
        batch = db.query(Batch).filter(Batch.id == payload.target_id).first()
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")
        batch_id = batch.id
        herb_id = batch.herb_id

        if payload.decision == "approved":
            batch.status = "verified"
            event_type = "verified"
        elif payload.decision == "rejected":
            batch.status = "rejected"
            event_type = "rejected"
        else:
            event_type = "note"

        db.add(BatchEvent(
            batch_id=batch.id,
            event_type=event_type,
            event_notes=payload.comments or f"Verification decision: {payload.decision}",
            performed_by=current_user.id,
        ))

    elif payload.target_type == "herb":
        herb = db.query(Herb).filter(Herb.id == payload.target_id).first()
        if not herb:
            raise HTTPException(status_code=404, detail="Herb not found")
        herb_id = herb.id

    elif payload.target_type == "ai_scan":
        scan = db.query(AIScanRecord).filter(AIScanRecord.id == payload.target_id).first()
        if not scan:
            raise HTTPException(status_code=404, detail="AI scan not found")
        ai_scan_id = scan.id
        herb_id = scan.predicted_herb_id
        scan.notes = (scan.notes or "") + f" | verification={payload.decision}"

    record = VerificationRecord(
        target_type=payload.target_type,
        target_id=payload.target_id,
        batch_id=batch_id,
        herb_id=herb_id,
        ai_scan_id=ai_scan_id,
        verifier_id=current_user.id,
        decision=payload.decision,
        confidence_score=payload.confidence_score,
        comments=payload.comments,
        evidence_url=payload.evidence_url,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return _to_response(record)


@router.get(
    "/",
    response_model=List[VerificationResponse],
    summary="List verification records"
)
def list_verifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    target_type: Optional[str] = None,
    decision: Optional[str] = None,
    batch_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("verifier", "admin")),
):
    q = db.query(VerificationRecord)
    if target_type:
        q = q.filter(VerificationRecord.target_type == target_type.lower())
    if decision:
        q = q.filter(VerificationRecord.decision == decision.lower())
    if batch_id:
        q = q.filter(VerificationRecord.batch_id == batch_id)

    rows = q.order_by(VerificationRecord.created_at.desc()).offset(skip).limit(limit).all()
    return [_to_response(r) for r in rows]


@router.get(
    "/{verification_id}",
    response_model=VerificationResponse,
    summary="Get one verification record"
)
def get_verification(
    verification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    row = db.query(VerificationRecord).filter(VerificationRecord.id == verification_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Verification record not found")
    return _to_response(row)


@router.get(
    "/batch/{batch_id}",
    response_model=List[VerificationResponse],
    summary="All verifications for a batch"
)
def verifications_for_batch(
    batch_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(VerificationRecord)
        .filter(VerificationRecord.batch_id == batch_id)
        .order_by(VerificationRecord.created_at.desc())
        .all()
    )
    return [_to_response(r) for r in rows]