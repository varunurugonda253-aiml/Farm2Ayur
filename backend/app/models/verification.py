from sqlalchemy import (
    Column, BigInteger, String, Text, DateTime, ForeignKey, Numeric
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base, BigIntPK

class VerificationRecord(Base):
    __tablename__ = "verification_records"

    id = Column(BigIntPK, primary_key=True, index=True)

    target_type = Column(String(30), nullable=False, index=True)  
    target_id = Column(BigInteger, nullable=False, index=True)
    batch_id = Column(BigInteger, ForeignKey("batches.id", ondelete="CASCADE"), index=True)
    herb_id = Column(BigInteger, ForeignKey("herbs.id", ondelete="SET NULL"), index=True)
    ai_scan_id = Column(BigInteger, ForeignKey("ai_scan_records.id", ondelete="SET NULL"), index=True)
    verifier_id = Column(BigInteger, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)
    decision = Column(String(30), nullable=False, index=True) 
    confidence_score = Column(Numeric(5, 4))
    comments = Column(Text)
    evidence_url = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    verifier = relationship("User")
    batch = relationship("Batch")
    herb = relationship("Herb")