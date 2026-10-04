from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class HerbNameBase(BaseModel):
    name: str
    name_type: str
    language: Optional[str] = None
    region: Optional[str] = None

class HerbNameCreate(HerbNameBase):
    pass  

class HerbNameResponse(HerbNameBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class BotanicalClassificationBase(BaseModel):
    kingdom: Optional[str] = "Plantae"
    phylum: Optional[str] = None
    class_name: Optional[str] = None
    subclass: Optional[str] = None
    order_name: Optional[str] = None
    family: Optional[str] = None
    genus: Optional[str] = None
    species: Optional[str] = None

class BotanicalClassificationCreate(BotanicalClassificationBase):
    pass

class BotanicalClassificationResponse(BotanicalClassificationBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class HabitatBase(BaseModel):
    native_region: Optional[str] = None
    present_in_india: Optional[bool] = True
    distribution_in_india: Optional[str] = None
    climate_zone: Optional[str] = None
    natural_habitat: Optional[str] = None
    primary_biome: Optional[str] = None

class HabitatCreate(HabitatBase):
    pass

class HabitatResponse(HabitatBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class TraditionalInfoBase(BaseModel):
    traditional_system: Optional[str] = "Ayurveda"
    cultural_importance: Optional[str] = None
    general_traditional_role: Optional[str] = None
    traditional_uses: Optional[str] = None

class TraditionalInfoCreate(TraditionalInfoBase):
    pass

class TraditionalInfoResponse(TraditionalInfoBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class SafetyInfoBase(BaseModel):
    preparation_type: str
    general_safety_note: Optional[str] = None
    precautions: Optional[str] = None
    contraindications: Optional[str] = None
    drug_interactions: Optional[str] = None
    pregnancy_lactation: Optional[str] = None
    verification_status: Optional[str] = "pending"

class SafetyInfoCreate(SafetyInfoBase):
    pass

class SafetyInfoResponse(SafetyInfoBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class HerbSourceBase(BaseModel):
    source_name: str
    source_type: Optional[str] = None
    source_url: Optional[str] = None
    verifies_field: Optional[str] = None
    verification_status: Optional[str] = "verified"

class HerbSourceCreate(HerbSourceBase):
    pass

class HerbSourceResponse(HerbSourceBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class HerbBase(BaseModel):
    herb_code: str
    primary_name: str
    sanskrit_name: Optional[str] = None
    scientific_name: str
    scientific_synonym: Optional[str] = None
    english_name: Optional[str] = None
    botanical_family: Optional[str] = None
    genus: Optional[str] = None
    plant_type: Optional[str] = None


class HerbCreate(HerbBase):
    names: List[HerbNameCreate] = []
    classification: Optional[BotanicalClassificationCreate] = None
    habitat: Optional[HabitatCreate] = None
    traditional_info: Optional[TraditionalInfoCreate] = None
    safety_records: List[SafetyInfoCreate] = []
    sources: List[HerbSourceCreate] = []


class HerbSimpleResponse(HerbBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class HerbDetailResponse(HerbBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    names: List[HerbNameResponse] = []
    classification: Optional[BotanicalClassificationResponse] = None
    habitat: Optional[HabitatResponse] = None
    traditional_info: Optional[TraditionalInfoResponse] = None
    safety_records: List[SafetyInfoResponse] = []
    sources: List[HerbSourceResponse] = []
    model_config = ConfigDict(from_attributes=True)