from sqlalchemy import (
    Column, BigInteger, String, Text, DateTime, ForeignKey, Boolean
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base, BigIntPK, JSONType

class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"

    id = Column(BigIntPK, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    herb_id = Column(BigInteger, ForeignKey("herbs.id", ondelete="SET NULL"), index=True)
    category = Column(String(100), default="ayurvedic_text")
    content = Column(Text, nullable=False)
    source_name = Column(String(150))
    source_url = Column(Text)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    herb = relationship("Herb")

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(BigIntPK, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    session_id = Column(String(100), nullable=False, index=True)
    user_message = Column(Text, nullable=False)
    bot_response = Column(Text, nullable=False)
    retrieved_sources = Column(JSONType)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    user = relationship("User")