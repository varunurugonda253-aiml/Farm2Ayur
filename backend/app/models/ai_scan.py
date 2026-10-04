from sqlalchemy import (
    Column, BigInteger, String, Text, DateTime, ForeignKey, Numeric
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base, BigIntPK, JSONType

class AIScanRecord(Base):
    __tablename__ = "ai_scan_records"

    id = Column(BigIntPK, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="SET NULL"), index=True)
    image_url = Column(Text, nullable=False)
    original_filename = Column(String(255))

    predicted_herb_id = Column(BigInteger, ForeignKey("herbs.id", ondelete="SET NULL"), index=True)
    predicted_name = Column(String(150))
    scientific_name = Column(String(150))
    confidence = Column(Numeric(5, 4))
    top_predictions = Column(JSONType)
    model_version = Column(String(50), default="hackathon-v1")
    status = Column(String(30), nullable=False, default="completed")
    notes = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    user = relationship("User")
    predicted_herb = relationship("Herb")