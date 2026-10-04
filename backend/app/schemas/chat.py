from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class ChatQueryRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default-session"

class SourceItem(BaseModel):
    title: str
    type: str  
    source_name: Optional[str] = None
    url: Optional[str] = None

class ChatQueryResponse(BaseModel):
    session_id: str
    user_message: str
    bot_response: str
    sources: List[SourceItem] = []
    disclaimer: str = "Traditional Ayurvedic information for educational purposes. Consult a licensed practitioner for medical advice."
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class KnowledgeDocCreate(BaseModel):
    title: str
    content: str
    herb_id: Optional[int] = None
    category: Optional[str] = "ayurvedic_text"
    source_name: Optional[str] = None
    source_url: Optional[str] = None

class KnowledgeDocResponse(KnowledgeDocCreate):
    id: int
    is_verified: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)