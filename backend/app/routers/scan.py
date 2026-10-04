import os
import uuid
import shutil
from typing import List

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.ai_scan import AIScanRecord
from app.schemas.ai_scan import AIScanResponse, AIScanListItem
from app.utils.auth import get_current_user
from app.services.ai_identifier import identify_plant

router = APIRouter(prefix="/scan", tags=["AI Plant Scanner"])

ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp"}

def _uploads_dir() -> str:
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    path = os.path.join(project_root, "static", "uploads")
    os.makedirs(path, exist_ok=True)
    return path

@router.post(
    "/",
    response_model=AIScanResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload plant image and run AI identification"
)
async def scan_plant(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image type. Allowed: {', '.join(sorted(ALLOWED_EXT))}"
        )

    saved_name = f"scan_{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(_uploads_dir(), saved_name)
    try:
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    finally:
        await file.close()

    relative_url = f"/static/uploads/{saved_name}"

    result = identify_plant(db=db, image_path=save_path, original_filename=file.filename)

    record = AIScanRecord(
        user_id=current_user.id,
        image_url=relative_url,
        original_filename=file.filename,
        predicted_herb_id=result.get("predicted_herb_id"),
        predicted_name=result.get("predicted_name"),
        scientific_name=result.get("scientific_name"),
        confidence=result.get("confidence"),
        top_predictions=result.get("top_predictions"),
        model_version=result.get("model_version"),
        status=result.get("status") or "completed",
        notes=result.get("notes"),
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    resp = AIScanResponse.model_validate(record)
    resp.full_image_url = f"http://127.0.0.1:8000{relative_url}"
    if record.status == "low_confidence":
        resp.message = "Low confidence. Consider retaking the photo."
    elif record.status == "completed":
        resp.message = "Scan completed successfully."
    else:
        resp.message = "Scan finished with warnings."
    return resp


@router.get(
    "/history",
    response_model=List[AIScanListItem],
    summary="List my previous AI scans"
)
def my_scan_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(AIScanRecord)
        .filter(AIScanRecord.user_id == current_user.id)
        .order_by(AIScanRecord.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return rows

@router.get(
    "/{scan_id}",
    response_model=AIScanResponse,
    summary="Get one scan record"
)
def get_scan(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    row = db.query(AIScanRecord).filter(AIScanRecord.id == scan_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Scan not found")

    if row.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")

    resp = AIScanResponse.model_validate(row)
    resp.full_image_url = f"http://127.0.0.1:8000{row.image_url}"
    return resp