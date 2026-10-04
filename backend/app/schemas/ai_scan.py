from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import datetime
from decimal import Decimal

class PredictionItem(BaseModel):
    herb_id: Optional[int] = None
    name: str
    scientific_name: Optional[str] = None
    confidence: float

class AIScanResponse(BaseModel):
    id: int
    image_url: str
    original_filename: Optional[str] = None
    predicted_herb_id: Optional[int] = None
    predicted_name: Optional[str] = None
    scientific_name: Optional[str] = None
    confidence: Optional[Decimal] = None
    top_predictions: Optional[List[Any]] = None
    model_version: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime

    full_image_url: Optional[str] = None
    message: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class AIScanListItem(BaseModel):
    id: int
    predicted_name: Optional[str] = None
    confidence: Optional[Decimal] = None
    status: str
    image_url: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)