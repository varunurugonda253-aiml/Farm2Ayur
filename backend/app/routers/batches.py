from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os

from app.database import get_db
from app.models.batch import Batch, BatchEvent
from app.models.herb import Herb
from app.models.user import User
from app.schemas.batch import (
    BatchCreate, BatchSimpleResponse, BatchDetailResponse,
    BatchEventCreate, BatchEventResponse, BatchStatusUpdate,
)
from app.utils.auth import get_current_user, require_roles
from app.utils.qrcode_gen import generate_batch_qr

router = APIRouter(prefix="/batches", tags=["Batches"])

def _next_batch_code(db: Session) -> str:
    year = datetime.now(timezone.utc).year
    prefix = f"B-{year}-"
    count = db.query(Batch).filter(Batch.batch_code.like(f"{prefix}%")).count()
    return f"{prefix}{count + 1:03d}"  

def _to_detail(batch: Batch) -> dict:
    data = BatchDetailResponse.model_validate(batch).model_dump()
    data["herb_name"] = batch.herb.primary_name if batch.herb else None
    data["collector_name"] = batch.collector.full_name if batch.collector else None
    return data

@router.post(
    "/",
    response_model=BatchDetailResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new herb batch"
)
def create_batch(
    payload: BatchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("collector", "admin")),
):
    herb = db.query(Herb).filter(Herb.id == payload.herb_id).first()
    if not herb:
        raise HTTPException(status_code=404, detail="Herb not found")

    batch_code = _next_batch_code(db)

    batch = Batch(
        batch_code=batch_code,
        herb_id=payload.herb_id,
        collector_id=current_user.id,
        harvest_date=payload.harvest_date,
        harvest_location=payload.harvest_location,
        latitude=payload.latitude,
        longitude=payload.longitude,
        quantity_kg=payload.quantity_kg,
        status="created",
        notes=payload.notes,
    )
    db.add(batch)
    db.flush() 

    first_event = BatchEvent(
        batch_id=batch.id,
        event_type="harvested",
        event_notes=f"Batch created with {payload.quantity_kg} kg",
        performed_by=current_user.id,
        location=payload.harvest_location,
    )
    db.add(first_event)

    try:
        qr_path = generate_batch_qr(batch_code)
        batch.qr_code_url = qr_path
    except Exception as e:
        batch.qr_code_url = None
        print(f"QR generation warning: {e}")

    db.commit()
    db.refresh(batch)
    return _to_detail(batch)

@router.get("/", response_model=List[BatchSimpleResponse], summary="List batches")
def list_batches(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    status_filter: Optional[str] = Query(None, alias="status"),
    herb_id: Optional[int] = None,
    search: Optional[str] = Query(None, description="Search by batch_code or location"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Batch)

    if status_filter:
        q = q.filter(Batch.status == status_filter.lower())
    if herb_id:
        q = q.filter(Batch.herb_id == herb_id)
    if search:
        like = f"%{search}%"
        q = q.filter(
            (Batch.batch_code.ilike(like)) | (Batch.harvest_location.ilike(like))
        )

    return q.order_by(Batch.created_at.desc()).offset(skip).limit(limit).all()

@router.get(
    "/code/{batch_code}",
    response_model=BatchDetailResponse,
    summary="Get batch by code with full timeline"
)
def get_batch_by_code(batch_code: str, db: Session = Depends(get_db)):
    batch = db.query(Batch).filter(Batch.batch_code == batch_code).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return _to_detail(batch)

@router.get("/{batch_id}", response_model=BatchDetailResponse)
def get_batch(batch_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return _to_detail(batch)

@router.post(
    "/{batch_id}/events",
    response_model=BatchEventResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add lifecycle event to batch"
)
def add_batch_event(
    batch_id: int,
    payload: BatchEventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("collector", "verifier", "admin")),
):
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    event = BatchEvent(
        batch_id=batch.id,
        event_type=payload.event_type,
        event_notes=payload.event_notes,
        performed_by=current_user.id,
        location=payload.location,
        event_timestamp=payload.event_timestamp or datetime.now(timezone.utc),
    )
    db.add(event)

    status_map = {
        "shipped": "in_transit",
        "verified": "verified",
        "rejected": "rejected",
        "delivered": "delivered",
    }
    if payload.event_type in status_map:
        batch.status = status_map[payload.event_type]

    db.commit()
    db.refresh(event)
    return event

@router.patch("/{batch_id}/status", response_model=BatchDetailResponse)
def update_batch_status(
    batch_id: int,
    payload: BatchStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("verifier", "admin")),
):
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    old = batch.status
    batch.status = payload.status
    if payload.notes:
        batch.notes = payload.notes

    db.add(BatchEvent(
        batch_id=batch.id,
        event_type=payload.status if payload.status in {"verified", "rejected", "delivered"} else "note",
        event_notes=payload.notes or f"Status changed {old} → {payload.status}",
        performed_by=current_user.id,
    ))

    db.commit()
    db.refresh(batch)
    return _to_detail(batch)

@router.get("/{batch_id}/qr", summary="Download QR image for batch")
def get_batch_qr(batch_id: int, db: Session = Depends(get_db)):
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    if not batch.qr_code_url:
        batch.qr_code_url = generate_batch_qr(batch.batch_code)
        db.commit()

    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    relative = batch.qr_code_url.lstrip("/") 
    filepath = os.path.join(project_root, *relative.split("/"))

    if not os.path.exists(filepath):
        batch.qr_code_url = generate_batch_qr(batch.batch_code)
        db.commit()
        relative = batch.qr_code_url.lstrip("/")
        filepath = os.path.join(project_root, *relative.split("/"))

    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="QR file not found")

    return FileResponse(filepath, media_type="image/png", filename=f"{batch.batch_code}.png")