from sqlalchemy import Column, BigInteger, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base, BigIntPK


class Herb(Base):
    __tablename__ = "herbs"

    id = Column(BigIntPK, primary_key=True, index=True)
    herb_code = Column(String(50), unique=True, nullable=False, index=True)
    primary_name = Column(String(100), nullable=False, index=True)
    sanskrit_name = Column(String(100))
    scientific_name = Column(String(150), nullable=False, index=True)
    scientific_synonym = Column(String(150))
    english_name = Column(String(100))
    botanical_family = Column(String(100))
    genus = Column(String(100))
    plant_type = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    names = relationship(
        "HerbName",
        back_populates="herb",
        cascade="all, delete-orphan",
    )
    classification = relationship(
        "BotanicalClassification",
        back_populates="herb",
        uselist=False,   # one-to-one, return single object
        cascade="all, delete-orphan",
    )
    habitat = relationship(
        "HabitatDistribution",
        back_populates="herb",
        uselist=False,
        cascade="all, delete-orphan",
    )
    traditional_info = relationship(
        "TraditionalInfo",
        back_populates="herb",
        uselist=False,
        cascade="all, delete-orphan",
    )
    safety_records = relationship(
        "SafetyInfo",
        back_populates="herb",
        cascade="all, delete-orphan",
    )
    sources = relationship(
        "HerbSource",
        back_populates="herb",
        cascade="all, delete-orphan",
    )


class HerbName(Base):
    __tablename__ = "herb_names"

    id = Column(BigIntPK, primary_key=True, index=True)
    herb_id = Column(BigInteger, ForeignKey("herbs.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False, index=True)
    name_type = Column(String(50), nullable=False)   # primary, sanskrit, synonym...
    language = Column(String(50))
    region = Column(String(100))

    herb = relationship("Herb", back_populates="names")


class BotanicalClassification(Base):
    __tablename__ = "botanical_classifications"

    id = Column(BigIntPK, primary_key=True, index=True)
    herb_id = Column(BigInteger, ForeignKey("herbs.id", ondelete="CASCADE"), unique=True, nullable=False)
    kingdom = Column(String(50), default="Plantae")
    phylum = Column(String(100))
    class_name = Column(String(100))
    subclass = Column(String(100))
    order_name = Column(String(100))
    family = Column(String(100))
    genus = Column(String(100))
    species = Column(String(100))

    herb = relationship("Herb", back_populates="classification")


class HabitatDistribution(Base):
    __tablename__ = "habitats"

    id = Column(BigIntPK, primary_key=True, index=True)
    herb_id = Column(BigInteger, ForeignKey("herbs.id", ondelete="CASCADE"), unique=True, nullable=False)
    native_region = Column(Text)
    present_in_india = Column(Boolean, default=True)
    distribution_in_india = Column(Text)
    climate_zone = Column(String(100))
    natural_habitat = Column(Text)
    primary_biome = Column(String(100))

    herb = relationship("Herb", back_populates="habitat")


class TraditionalInfo(Base):
    __tablename__ = "traditional_info"

    id = Column(BigIntPK, primary_key=True, index=True)
    herb_id = Column(BigInteger, ForeignKey("herbs.id", ondelete="CASCADE"), unique=True, nullable=False)
    traditional_system = Column(String(100), default="Ayurveda")
    cultural_importance = Column(Text)
    general_traditional_role = Column(Text)
    traditional_uses = Column(Text)

    herb = relationship("Herb", back_populates="traditional_info")


class SafetyInfo(Base):
    __tablename__ = "safety_info"

    id = Column(BigIntPK, primary_key=True, index=True)
    herb_id = Column(BigInteger, ForeignKey("herbs.id", ondelete="CASCADE"), nullable=False, index=True)
    preparation_type = Column(String(100), nullable=False)
    general_safety_note = Column(Text)
    precautions = Column(Text)
    contraindications = Column(Text)
    drug_interactions = Column(Text)
    pregnancy_lactation = Column(Text)
    verification_status = Column(String(50), default="pending")

    herb = relationship("Herb", back_populates="safety_records")


class HerbSource(Base):
    __tablename__ = "herb_sources"

    id = Column(BigIntPK, primary_key=True, index=True)
    herb_id = Column(BigInteger, ForeignKey("herbs.id", ondelete="CASCADE"), nullable=False, index=True)
    source_name = Column(String(150), nullable=False)
    source_type = Column(String(50))
    source_url = Column(Text)
    verifies_field = Column(String(100))
    verification_status = Column(String(50), default="verified")
    last_updated = Column(DateTime(timezone=True), server_default=func.now())

    herb = relationship("Herb", back_populates="sources")