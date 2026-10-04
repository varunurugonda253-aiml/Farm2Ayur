from pydantic import BaseModel, ConfigDict
from typing import Optional, Any, Dict
from datetime import datetime

class BlockchainAnchorRequest(BaseModel):
    batch_id: int
    record_type: str = "batch_anchor" 
    batch_event_id: Optional[int] = None
    notes: Optional[str] = None

class BlockchainRecordResponse(BaseModel):
    id: int
    batch_id: int
    batch_event_id: Optional[int] = None
    record_type: str
    data_payload: Dict[str, Any]
    data_hash: str
    previous_hash: Optional[str] = None
    network: Optional[str] = None
    transaction_hash: Optional[str] = None
    wallet_address: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class BlockchainVerifyResponse(BaseModel):
    batch_id: int
    batch_code: Optional[str] = None
    is_valid: bool
    checks: Dict[str, Any]
    latest_record: Optional[BlockchainRecordResponse] = None
    message: str