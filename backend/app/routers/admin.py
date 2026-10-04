from datetime import datetime, timedelta, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel, ConfigDict, EmailStr
from sqlalchemy import func, desc
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.herb import Herb
from app.models.batch import Batch, BatchEvent
from app.models.ai_scan import AIScanRecord
from app.models.verification import VerificationRecord
from app.models.blockchain import BlockchainRecord
from app.utils.auth import require_roles, hash_password

router = APIRouter(prefix="/admin", tags=["Admin Management"])

class DashboardStats(BaseModel):
    total_users: int
    users_by_role: dict
    total_herbs: int
    total_batches: int
    batches_by_status: dict
    total_ai_scans: int
    ai_scans_low_confidence: int
    total_verifications: int
    verifications_by_decision: dict
    total_blockchain_records: int
    recent_batches_7d: int
    recent_scans_7d: int

class UserAdminResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    organization: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class UserRoleUpdate(BaseModel):
    role: str

class UserActiveUpdate(BaseModel):
    is_active: bool

class RecentActivityItem(BaseModel):
    type: str
    id: int
    title: str
    created_at: Optional[datetime] = None
    meta: dict = {}

@router.get("/dashboard", response_model=DashboardStats, summary="Admin dashboard overview stats")
def admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_herbs = db.query(func.count(Herb.id)).scalar() or 0
    total_batches = db.query(func.count(Batch.id)).scalar() or 0
    total_ai_scans = db.query(func.count(AIScanRecord.id)).scalar() or 0
    total_verifications = db.query(func.count(VerificationRecord.id)).scalar() or 0
    total_blockchain_records = db.query(func.count(BlockchainRecord.id)).scalar() or 0

    role_rows = db.query(User.role, func.count(User.id)).group_by(User.role).all()
    users_by_role = {r or "unknown": c for r, c in role_rows}

    batch_rows = db.query(Batch.status, func.count(Batch.id)).group_by(Batch.status).all()
    batches_by_status = {s or "unknown": c for s, c in batch_rows}

    ver_rows = (
        db.query(VerificationRecord.decision, func.count(VerificationRecord.id))
        .group_by(VerificationRecord.decision)
        .all()
    )
    verifications_by_decision = {d or "unknown": c for d, c in ver_rows}

    low_conf = (
        db.query(func.count(AIScanRecord.id))
        .filter(AIScanRecord.status == "low_confidence")
        .scalar()
        or 0
    )

    since = datetime.now(timezone.utc) - timedelta(days=7)
    recent_batches_7d = (
        db.query(func.count(Batch.id)).filter(Batch.created_at >= since).scalar() or 0
    )
    recent_scans_7d = (
        db.query(func.count(AIScanRecord.id)).filter(AIScanRecord.created_at >= since).scalar() or 0
    )

    return {
        "total_users": total_users,
        "users_by_role": users_by_role,
        "total_herbs": total_herbs,
        "total_batches": total_batches,
        "batches_by_status": batches_by_status,
        "total_ai_scans": total_ai_scans,
        "ai_scans_low_confidence": low_conf,
        "total_verifications": total_verifications,
        "verifications_by_decision": verifications_by_decision,
        "total_blockchain_records": total_blockchain_records,
        "recent_batches_7d": recent_batches_7d,
        "recent_scans_7d": recent_scans_7d,
    }

@router.get("/users", response_model=List[UserAdminResponse], summary="List all users")
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    q = db.query(User)
    if role:
        q = q.filter(User.role == role.lower())
    if is_active is not None:
        q = q.filter(User.is_active == is_active)
    if search:
        like = f"%{search}%"
        q = q.filter((User.full_name.ilike(like)) | (User.email.ilike(like)))
    return q.order_by(User.created_at.desc()).offset(skip).limit(limit).all()


@router.patch("/users/{user_id}/role", response_model=UserAdminResponse, summary="Change user role")
def update_user_role(
    user_id: int,
    payload: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    allowed = {"user", "collector", "verifier", "admin"}
    role = payload.role.lower().strip()
    if role not in allowed:
        raise HTTPException(status_code=400, detail=f"role must be one of: {', '.join(sorted(allowed))}")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = role
    db.commit()
    db.refresh(user)
    return user


@router.patch("/users/{user_id}/active", response_model=UserAdminResponse, summary="Activate/deactivate user")
def update_user_active(
    user_id: int,
    payload: UserActiveUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id and payload.is_active is False:
        raise HTTPException(status_code=400, detail="You cannot deactivate yourself")

    user.is_active = payload.is_active
    db.commit()
    db.refresh(user)
    return user

@router.get("/batches/monitoring", summary="Batch monitoring list")
def monitor_batches(
    status_filter: Optional[str] = Query(None, alias="status"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    q = db.query(Batch)
    if status_filter:
        q = q.filter(Batch.status == status_filter.lower())
    rows = q.order_by(Batch.created_at.desc()).limit(limit).all()
    return [
        {
            "id": b.id,
            "batch_code": b.batch_code,
            "herb_id": b.herb_id,
            "herb_name": b.herb.primary_name if b.herb else None,
            "collector_id": b.collector_id,
            "collector_name": b.collector.full_name if b.collector else None,
            "status": b.status,
            "quantity_kg": float(b.quantity_kg) if b.quantity_kg is not None else None,
            "harvest_location": b.harvest_location,
            "created_at": b.created_at,
        }
        for b in rows
    ]

@router.get("/ai/monitoring", summary="AI scan monitoring")
def monitor_ai_scans(
    status_filter: Optional[str] = Query(None, alias="status"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    q = db.query(AIScanRecord)
    if status_filter:
        q = q.filter(AIScanRecord.status == status_filter.lower())
    rows = q.order_by(AIScanRecord.created_at.desc()).limit(limit).all()
    return [
        {
            "id": s.id,
            "user_id": s.user_id,
            "predicted_name": s.predicted_name,
            "confidence": float(s.confidence) if s.confidence is not None else None,
            "status": s.status,
            "image_url": s.image_url,
            "model_version": s.model_version,
            "created_at": s.created_at,
        }
        for s in rows
    ]

@router.get("/verifications/monitoring", summary="Verification monitoring")
def monitor_verifications(
    decision: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    q = db.query(VerificationRecord)
    if decision:
        q = q.filter(VerificationRecord.decision == decision.lower())
    rows = q.order_by(VerificationRecord.created_at.desc()).limit(limit).all()
    return [
        {
            "id": v.id,
            "target_type": v.target_type,
            "target_id": v.target_id,
            "batch_id": v.batch_id,
            "decision": v.decision,
            "verifier_id": v.verifier_id,
            "verifier_name": v.verifier.full_name if v.verifier else None,
            "comments": v.comments,
            "created_at": v.created_at,
        }
        for v in rows
    ]

@router.get("/activity/recent", response_model=List[RecentActivityItem], summary="Recent system activity feed")
def recent_activity(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    items: list[RecentActivityItem] = []

    for b in db.query(Batch).order_by(desc(Batch.created_at)).limit(limit).all():
        items.append(RecentActivityItem(
            type="batch",
            id=b.id,
            title=f"Batch {b.batch_code} ({b.status})",
            created_at=b.created_at,
            meta={"herb_id": b.herb_id, "collector_id": b.collector_id},
        ))

    for s in db.query(AIScanRecord).order_by(desc(AIScanRecord.created_at)).limit(limit).all():
        items.append(RecentActivityItem(
            type="ai_scan",
            id=s.id,
            title=f"AI scan → {s.predicted_name or 'unknown'} ({s.status})",
            created_at=s.created_at,
            meta={"confidence": float(s.confidence) if s.confidence is not None else None},
        ))

    for v in db.query(VerificationRecord).order_by(desc(VerificationRecord.created_at)).limit(limit).all():
        items.append(RecentActivityItem(
            type="verification",
            id=v.id,
            title=f"Verification {v.decision} on {v.target_type} #{v.target_id}",
            created_at=v.created_at,
            meta={"verifier_id": v.verifier_id},
        ))

    for c in db.query(BlockchainRecord).order_by(desc(BlockchainRecord.created_at)).limit(limit).all():
        items.append(RecentActivityItem(
            type="blockchain",
            id=c.id,
            title=f"Blockchain anchor for batch #{c.batch_id}",
            created_at=c.created_at,
            meta={"tx": c.transaction_hash, "hash": c.data_hash},
        ))

    items.sort(key=lambda x: x.created_at or datetime.min.replace(tzinfo=timezone.utc), reverse=True)
    return items[:limit]