from sqlalchemy import (
    Column, BigInteger, String, Text, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base, BigIntPK, JSONType

class BlockchainRecord(Base):
    __tablename__ = "blockchain_records"

    id = Column(BigIntPK, primary_key=True, index=True)
    batch_id = Column(BigInteger, ForeignKey("batches.id", ondelete="CASCADE"), nullable=False, index=True)
    batch_event_id = Column(BigInteger, ForeignKey("batch_events.id", ondelete="SET NULL"))
    record_type = Column(String(50), nullable=False, default="batch_anchor")
    data_payload = Column(JSONType, nullable=False)
    data_hash = Column(String(64), nullable=False, index=True)
    previous_hash = Column(String(64))
    network = Column(String(50), default="mock-chain")
    transaction_hash = Column(String(255), index=True)
    wallet_address = Column(String(255))
    status = Column(String(30), nullable=False, default="anchored")
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    batch = relationship("Batch")