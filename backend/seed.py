"""Seed the herbs that the Farm2Ayur V9 model knows.
Safe to run again: herbs that already exist are skipped."""
import app.models  # noqa: F401  (loads all tables before we use them)
from app.database import SessionLocal, init_db
from app.models.herb import (
    Herb, BotanicalClassification, HabitatDistribution, TraditionalInfo,
)

HERBS = [
    {
        "herb": dict(
            herb_code="HERB-002", primary_name="Amla", sanskrit_name="Amalaki",
            scientific_name="Phyllanthus emblica",
            scientific_synonym="Emblica officinalis",
            english_name="Indian Gooseberry", botanical_family="Phyllanthaceae",
            genus="Phyllanthus", plant_type="Tree",
        ),
        "classification": dict(
            phylum="Tracheophyta", class_name="Magnoliopsida",
            order_name="Malpighiales", family="Phyllanthaceae",
            genus="Phyllanthus", species="emblica",
        ),
        "habitat": dict(
            native_region="Tropical and southern Asia", present_in_india=True,
            distribution_in_india="Found across India, widely cultivated",
            climate_zone="Tropical and subtropical",
            natural_habitat="Deciduous and mixed forests",
            primary_biome="Deciduous forest",
        ),
        "traditional": dict(
            traditional_system="Ayurveda",
            cultural_importance="Key Rasayana fruit, used in Chyawanprash",
            general_traditional_role="Rejuvenating fruit",
            traditional_uses="Used traditionally for digestion and vitality",
        ),
    },
    {
        "herb": dict(
            herb_code="HERB-003", primary_name="Guduchi", sanskrit_name="Guduchi",
            scientific_name="Tinospora cordifolia",
            english_name="Heart-leaved Moonseed", botanical_family="Menispermaceae",
            genus="Tinospora", plant_type="Climber",
        ),
        "classification": dict(
            phylum="Tracheophyta", class_name="Magnoliopsida",
            order_name="Ranunculales", family="Menispermaceae",
            genus="Tinospora", species="cordifolia",
        ),
        "habitat": dict(
            native_region="Indian subcontinent, Sri Lanka, Myanmar",
            present_in_india=True,
            distribution_in_india="Found across India",
            climate_zone="Tropical and subtropical",
            natural_habitat="Climbs on trees and shrubs in forests",
            primary_biome="Deciduous forest",
        ),
        "traditional": dict(
            traditional_system="Ayurveda",
            cultural_importance="Also called Amrita in Ayurveda",
            general_traditional_role="General tonic",
            traditional_uses="Used traditionally as a tonic and for fever",
        ),
    },
    {
        "herb": dict(
            herb_code="HERB-004", primary_name="Neem", sanskrit_name="Nimba",
            scientific_name="Azadirachta indica",
            english_name="Indian Lilac", botanical_family="Meliaceae",
            genus="Azadirachta", plant_type="Tree",
        ),
        "classification": dict(
            phylum="Tracheophyta", class_name="Magnoliopsida",
            order_name="Sapindales", family="Meliaceae",
            genus="Azadirachta", species="indica",
        ),
        "habitat": dict(
            native_region="Indian subcontinent", present_in_india=True,
            distribution_in_india="Found throughout India",
            climate_zone="Tropical and subtropical",
            natural_habitat="Dry and semi-arid plains",
            primary_biome="Tropical dry forest",
        ),
        "traditional": dict(
            traditional_system="Ayurveda",
            cultural_importance="Widely valued in Indian homes and traditional medicine",
            general_traditional_role="Purifying herb",
            traditional_uses="Used traditionally for skin care and oral hygiene",
        ),
    },
    {
        "herb": dict(
            herb_code="HERB-005", primary_name="Tulsi", sanskrit_name="Tulasi",
            scientific_name="Ocimum tenuiflorum",
            scientific_synonym="Ocimum sanctum",
            english_name="Holy Basil", botanical_family="Lamiaceae",
            genus="Ocimum", plant_type="Herb",
        ),
        "classification": dict(
            phylum="Tracheophyta", class_name="Magnoliopsida",
            order_name="Lamiales", family="Lamiaceae",
            genus="Ocimum", species="tenuiflorum",
        ),
        "habitat": dict(
            native_region="Indian subcontinent", present_in_india=True,
            distribution_in_india="Found throughout India, grown in homes and temples",
            climate_zone="Tropical and subtropical",
            natural_habitat="Warm, sunny ground and cultivated gardens",
            primary_biome="Tropical",
        ),
        "traditional": dict(
            traditional_system="Ayurveda",
            cultural_importance="Sacred plant in many Hindu households",
            general_traditional_role="Wellness herb",
            traditional_uses="Used traditionally for cough, colds and stress",
        ),
    },
]


def main():
    init_db()
    db = SessionLocal()
    try:
        for item in HERBS:
            h = item["herb"]
            exists = db.query(Herb).filter(
                (Herb.herb_code == h["herb_code"])
                | (Herb.primary_name.ilike(h["primary_name"]))
            ).first()
            if exists:
                print(f"SKIP  {h['herb_code']} {h['primary_name']} (already in database)")
                continue
            herb = Herb(**h)
            herb.classification = BotanicalClassification(**item["classification"])
            herb.habitat = HabitatDistribution(**item["habitat"])
            herb.traditional_info = TraditionalInfo(**item["traditional"])
            db.add(herb)
            print(f"ADD   {h['herb_code']} {h['primary_name']}")
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
    print("Done.")


if __name__ == "__main__":
    main()