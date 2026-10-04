from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.batch import Batch
from app.models.blockchain import BlockchainRecord
from app.schemas.blockchain import (
    BlockchainAnchorRequest,
    BlockchainRecordResponse,
    BlockchainVerifyResponse,
)
from app.services.blockchain import anchor_batch, verify_batch_records
from app.utils.auth import get_current_user, require_roles

router = APIRouter(prefix="/blockchain", tags=["Blockchain"])

@router.post(
    "/anchor",
    response_model=BlockchainRecordResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Anchor a batch snapshot on-chain (mock/real provider)"
)
def anchor_batch_endpoint(
    payload: BlockchainAnchorRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("collector", "verifier", "admin")),
):
    batch = db.query(Batch).filter(Batch.id == payload.batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    record = anchor_batch(
        db=db,
        batch=batch,
        record_type=payload.record_type or "batch_anchor",
        batch_event_id=payload.batch_event_id,
        notes=payload.notes,
    )
    return record

@router.get(
    "/batch/{batch_id}",
    response_model=List[BlockchainRecordResponse],
    summary="List blockchain records for a batch"
)
def list_batch_blockchain(batch_id: int, db: Session = Depends(get_db)):
    rows = (
        db.query(BlockchainRecord)
        .filter(BlockchainRecord.batch_id == batch_id)
        .order_by(BlockchainRecord.id.asc())
        .all()
    )
    return rows

@router.get(
    "/tx/{transaction_hash}",
    response_model=BlockchainRecordResponse,
    summary="Lookup by transaction hash"
)
def get_by_tx(transaction_hash: str, db: Session = Depends(get_db)):
    row = (
        db.query(BlockchainRecord)
        .filter(BlockchainRecord.transaction_hash == transaction_hash)
        .first()
    )
    if not row:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return row

@router.get(
    "/verify/{batch_id}",
    response_model=BlockchainVerifyResponse,
    summary="Verify batch blockchain integrity"
)
def verify_batch(batch_id: int, db: Session = Depends(get_db)):
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    result = verify_batch_records(db, batch)
    latest = result.get("latest_record")
    latest_resp = BlockchainRecordResponse.model_validate(latest) if latest else None

    return {
        "batch_id": batch.id,
        "batch_code": batch.batch_code,
        "is_valid": result["is_valid"],
        "checks": result["checks"],
        "latest_record": latest_resp,
        "message": result["message"],
    }

@router.get(
    "/verify/code/{batch_code}",
    response_model=BlockchainVerifyResponse,
    summary="Verify by batch code (public-friendly)"
)
def verify_batch_code(batch_code: str, db: Session = Depends(get_db)):
    batch = db.query(Batch).filter(Batch.batch_code == batch_code).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    result = verify_batch_records(db, batch)
    latest = result.get("latest_record")
    latest_resp = BlockchainRecordResponse.model_validate(latest) if latest else None

    return {
        "batch_id": batch.id,
        "batch_code": batch.batch_code,
        "is_valid": result["is_valid"],
        "checks": result["checks"],
        "latest_record": latest_resp,
        "message": result["message"],
    }