from sqlalchemy import (
    Column, BigInteger, String, Text, Date, DateTime,
    ForeignKey, Numeric
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base, BigIntPK

class Batch(Base):
    __tablename__ = "batches"

    id = Column(BigIntPK, primary_key=True, index=True)
    batch_code = Column(String(50), unique=True, nullable=False, index=True)

    herb_id = Column(BigInteger, ForeignKey("herbs.id", ondelete="RESTRICT"), nullable=False, index=True)
    collector_id = Column(BigInteger, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)

    harvest_date = Column(Date, nullable=False)
    harvest_location = Column(Text, nullable=False)
    latitude = Column(Numeric(9, 6))
    longitude = Column(Numeric(9, 6))
    quantity_kg = Column(Numeric(10, 2), nullable=False)

    status = Column(String(30), nullable=False, default="created", index=True)
    notes = Column(Text)
    qr_code_url = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    herb = relationship("Herb")
    collector = relationship("User")
    events = relationship(
        "BatchEvent",
        back_populates="batch",
        cascade="all, delete-orphan",
        order_by="BatchEvent.event_timestamp"
    )

class BatchEvent(Base):
    __tablename__ = "batch_events"

    id = Column(BigIntPK, primary_key=True, index=True)
    batch_id = Column(BigInteger, ForeignKey("batches.id", ondelete="CASCADE"), nullable=False, index=True)

    event_type = Column(String(50), nullable=False, index=True)
    event_notes = Column(Text)
    performed_by = Column(BigInteger, ForeignKey("users.id", ondelete="SET NULL"))
    location = Column(Text)
    event_timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    blockchain_tx_hash = Column(String(255))

    batch = relationship("Batch", back_populates="events")
    performer = relationship("User")