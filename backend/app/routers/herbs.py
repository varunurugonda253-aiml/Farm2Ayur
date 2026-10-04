from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.herb import (
    Herb, HerbName, BotanicalClassification,
    HabitatDistribution, TraditionalInfo, SafetyInfo, HerbSource,
)
from app.schemas.herb import (
    HerbCreate, HerbSimpleResponse, HerbDetailResponse,
)

router = APIRouter(
    prefix="/herbs", 
    tags=["Herbs"],  
)

@router.post(
    "/",
    response_model=HerbDetailResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new herb (with names, classification, habitat, etc.)"
)
def create_herb(payload: HerbCreate, db: Session = Depends(get_db)):
    existing = db.query(Herb).filter(Herb.herb_code == payload.herb_code).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Herb code {payload.herb_code} already exists.",
        )

    new_herb = Herb(
        herb_code=payload.herb_code,
        primary_name=payload.primary_name,
        sanskrit_name=payload.sanskrit_name,
        scientific_name=payload.scientific_name,
        scientific_synonym=payload.scientific_synonym,
        english_name=payload.english_name,
        botanical_family=payload.botanical_family,
        genus=payload.genus,
        plant_type=payload.plant_type,
    )

    new_herb.names = [HerbName(**n.model_dump()) for n in payload.names]

    if payload.classification:
        new_herb.classification = BotanicalClassification(**payload.classification.model_dump())

    if payload.habitat:
        new_herb.habitat = HabitatDistribution(**payload.habitat.model_dump())

    if payload.traditional_info:
        new_herb.traditional_info = TraditionalInfo(**payload.traditional_info.model_dump())

    new_herb.safety_records = [SafetyInfo(**s.model_dump()) for s in payload.safety_records]
    new_herb.sources = [HerbSource(**s.model_dump()) for s in payload.sources]

    db.add(new_herb)    
    db.commit()         
    db.refresh(new_herb) 
    return new_herb

@router.get(
    "/",
    response_model=List[HerbSimpleResponse],
    summary="List all herbs (light summary)"
)
def list_herbs(
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(50, ge=1, le=200, description="Max herbs to return"),
    search: Optional[str] = Query(None, description="Search by primary or scientific name"),
    db: Session = Depends(get_db),
):
    query = db.query(Herb)

    if search:
        like = f"%{search}%"
        query = query.filter(
            (Herb.primary_name.ilike(like)) | (Herb.scientific_name.ilike(like))
        )

    return query.offset(skip).limit(limit).all()

@router.get(
    "/{herb_id}",
    response_model=HerbDetailResponse,
    summary="Get one herb with full details"
)
def get_herb(herb_id: int, db: Session = Depends(get_db)):
    herb = db.query(Herb).filter(Herb.id == herb_id).first()
    if not herb:
        raise HTTPException(status_code=404, detail="Herb not found")
    return herb

@router.get(
    "/code/{herb_code}",
    response_model=HerbDetailResponse,
    summary="Get one herb by its human-friendly code (e.g., HERB-002)"
)
def get_herb_by_code(herb_code: str, db: Session = Depends(get_db)):
    herb = db.query(Herb).filter(Herb.herb_code == herb_code).first()
    if not herb:
        raise HTTPException(status_code=404, detail="Herb not found")
    return herb

@router.delete(
    "/{herb_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a herb (cascades to all related rows)"
)
def delete_herb(herb_id: int, db: Session = Depends(get_db)):
    herb = db.query(Herb).filter(Herb.id == herb_id).first()
    if not herb:
        raise HTTPException(status_code=404, detail="Herb not found")
    db.delete(herb)
    db.commit()
    return None