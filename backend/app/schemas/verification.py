from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional
from datetime import datetime
from decimal import Decimal

ALLOWED_TARGET_TYPES = {"batch", "herb", "ai_scan"}
ALLOWED_DECISIONS = {"approved", "rejected", "needs_review"}

class VerificationCreate(BaseModel):
    target_type: str
    target_id: int
    decision: str
    confidence_score: Optional[Decimal] = None
    comments: Optional[str] = None
    evidence_url: Optional[str] = None

    @field_validator("target_type")
    @classmethod
    def validate_target_type(cls, v: str) -> str:
        v = v.lower().strip()
        if v not in ALLOWED_TARGET_TYPES:
            raise ValueError(f"target_type must be one of: {', '.join(sorted(ALLOWED_TARGET_TYPES))}")
        return v

    @field_validator("decision")
    @classmethod
    def validate_decision(cls, v: str) -> str:
        v = v.lower().strip()
        if v not in ALLOWED_DECISIONS:
            raise ValueError(f"decision must be one of: {', '.join(sorted(ALLOWED_DECISIONS))}")
        return v

class VerificationResponse(BaseModel):
    id: int
    target_type: str
    target_id: int
    batch_id: Optional[int] = None
    herb_id: Optional[int] = None
    ai_scan_id: Optional[int] = None
    verifier_id: int
    decision: str
    confidence_score: Optional[Decimal] = None
    comments: Optional[str] = None
    evidence_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    verifier_name: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)