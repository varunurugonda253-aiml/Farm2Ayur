from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal

ALLOWED_BATCH_STATUS = {
    "created", "in_transit", "verified", "rejected", "delivered"
}

ALLOWED_EVENT_TYPES = {
    "harvested", "dried", "packaged", "lab_tested",
    "shipped", "delivered", "verified", "rejected", "note"
}

class BatchEventCreate(BaseModel):
    event_type: str
    event_notes: Optional[str] = None
    location: Optional[str] = None
    event_timestamp: Optional[datetime] = None

    @field_validator("event_type")
    @classmethod
    def validate_event_type(cls, v: str) -> str:
        v = v.lower().strip()
        if v not in ALLOWED_EVENT_TYPES:
            raise ValueError(f"event_type must be one of: {', '.join(sorted(ALLOWED_EVENT_TYPES))}")
        return v

class BatchEventResponse(BaseModel):
    id: int
    event_type: str
    event_notes: Optional[str] = None
    performed_by: Optional[int] = None
    location: Optional[str] = None
    event_timestamp: datetime
    blockchain_tx_hash: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class BatchCreate(BaseModel):
    herb_id: int
    harvest_date: date
    harvest_location: str
    quantity_kg: Decimal
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    notes: Optional[str] = None

class BatchStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        v = v.lower().strip()
        if v not in ALLOWED_BATCH_STATUS:
            raise ValueError(f"status must be one of: {', '.join(sorted(ALLOWED_BATCH_STATUS))}")
        return v

class BatchSimpleResponse(BaseModel):
    id: int
    batch_code: str
    herb_id: int
    collector_id: int
    harvest_date: date
    harvest_location: str
    quantity_kg: Decimal
    status: str
    qr_code_url: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class BatchDetailResponse(BaseModel):
    id: int
    batch_code: str
    herb_id: int
    collector_id: int
    harvest_date: date
    harvest_location: str
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    quantity_kg: Decimal
    status: str
    notes: Optional[str] = None
    qr_code_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    events: List[BatchEventResponse] = []

    herb_name: Optional[str] = None
    collector_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)