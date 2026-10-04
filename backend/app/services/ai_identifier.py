import os
import re
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.herb import Herb, HerbName

LOW_CONFIDENCE_THRESHOLD = 0.55
MODEL_VERSION = "farm2ayur-v9"

# Farm2Ayur V9 5-class botanical index mapping
HERB_CLASSES: List[str] = [
    "Amla",
    "Ashwagandha",
    "Guduchi",
    "Neem",
    "Tulsi",
]

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(_PROJECT_ROOT, "ml", "farm2ayur_v9_best.keras")

_MODEL = None
_MODEL_LOAD_FAILED = False


def _get_model():
    """Lazy load the Keras V9 model as a singleton."""
    global _MODEL, _MODEL_LOAD_FAILED
    if _MODEL is not None:
        return _MODEL
    if _MODEL_LOAD_FAILED:
        return None

    if not os.path.exists(MODEL_PATH):
        print(f"[AI Scanner] Model file not found at {MODEL_PATH}. Falling back to heuristic.")
        _MODEL_LOAD_FAILED = True
        return None

    try:
        # Suppress verbose TensorFlow logs
        os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
        try:
            import keras
            _MODEL = keras.models.load_model(MODEL_PATH, compile=False)
        except Exception:
            import tensorflow as tf
            _MODEL = tf.keras.models.load_model(MODEL_PATH, compile=False)

        print(f"[AI Scanner] Farm2Ayur V9 model loaded successfully from {MODEL_PATH}")
        return _MODEL
    except Exception as e:
        print(f"[AI Scanner] Failed to load Keras model: {e}")
        _MODEL_LOAD_FAILED = True
        return None


def _preprocess_image(image_path: str):
    """Load and preprocess image to (1, 224, 224, 3) raw RGB array for MobileNetV2."""
    from PIL import Image
    import numpy as np

    with Image.open(image_path) as img:
        img = img.convert("RGB")
        img = img.resize((224, 224), Image.Resampling.BILINEAR)
        img_array = np.array(img, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)
        return img_array


def _find_herb_in_db(db: Session, class_name: str) -> Optional[Herb]:
    """Find herb database record matching the predicted class name."""
    # 1. Exact or case-insensitive match on primary_name
    herb = db.query(Herb).filter(Herb.primary_name.ilike(class_name)).first()
    if herb:
        return herb

    # 2. Check English or Sanskrit name
    herb = db.query(Herb).filter(
        (Herb.english_name.ilike(f"%{class_name}%")) |
        (Herb.sanskrit_name.ilike(f"%{class_name}%")) |
        (Herb.scientific_name.ilike(f"%{class_name}%"))
    ).first()
    if herb:
        return herb

    # 3. Check vernacular/synonym names
    synonym = db.query(HerbName).filter(HerbName.name.ilike(f"%{class_name}%")).first()
    if synonym and synonym.herb:
        return synonym.herb

    return None


def _normalize(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", (text or "").lower())


def _heuristic_fallback(
    db: Session,
    original_filename: Optional[str] = None,
    note_prefix: str = "Fallback heuristic used."
) -> Dict[str, Any]:
    """Fallback string matching when model is unavailable."""
    herbs = db.query(Herb).all()
    if not herbs:
        return {
            "predicted_herb_id": None,
            "predicted_name": None,
            "scientific_name": None,
            "confidence": 0.0,
            "top_predictions": [],
            "status": "failed",
            "notes": f"{note_prefix} No herbs in database to match against.",
            "model_version": f"{MODEL_VERSION}-fallback",
        }

    filename_key = _normalize(original_filename or "")
    scores: List[Dict[str, Any]] = []

    for herb in herbs:
        score = 0.05
        candidates = [
            herb.primary_name or "",
            herb.english_name or "",
            herb.sanskrit_name or "",
            herb.scientific_name or "",
            herb.genus or "",
        ]
        for n in (herb.names or []):
            candidates.append(n.name or "")

        for c in candidates:
            key = _normalize(c)
            if not key:
                continue
            if key in filename_key or filename_key in key:
                score = max(score, 0.93)
            else:
                for token in re.findall(r"[a-z]+", (original_filename or "").lower()):
                    if len(token) >= 4 and token in key:
                        score = max(score, 0.78)

        scores.append({
            "herb_id": herb.id,
            "name": herb.primary_name,
            "scientific_name": herb.scientific_name,
            "confidence": round(float(score), 4),
        })

    scores.sort(key=lambda x: x["confidence"], reverse=True)
    top = scores[:3]
    best = top[0]

    if best["confidence"] < 0.2:
        for i, s in enumerate(top):
            s["confidence"] = round(0.42 - i * 0.08, 4)
        best = top[0]
        status = "low_confidence"
        notes = f"{note_prefix} Model uncertain — showing closest herbs from database."
    elif best["confidence"] < LOW_CONFIDENCE_THRESHOLD:
        status = "low_confidence"
        notes = f"{note_prefix} Low confidence prediction. Please retake photo with clearer leaf/plant view."
    else:
        status = "completed"
        notes = f"{note_prefix} Heuristic prediction matched from file metadata."

    return {
        "predicted_herb_id": best.get("herb_id"),
        "predicted_name": best.get("name"),
        "scientific_name": best.get("scientific_name"),
        "confidence": best.get("confidence"),
        "top_predictions": top,
        "status": status,
        "notes": notes,
        "model_version": f"{MODEL_VERSION}-fallback",
    }


def identify_plant(
    db: Session,
    image_path: str,
    original_filename: Optional[str] = None,
) -> Dict[str, Any]:
    """Run Farm2Ayur V9 Keras model inference on uploaded plant image."""
    model = _get_model()

    if model is None:
        return _heuristic_fallback(
            db=db,
            original_filename=original_filename,
            note_prefix="V9 model not active in runtime."
        )

    try:
        # 1. Preprocess image
        img_array = _preprocess_image(image_path)

        # 2. Run model inference
        raw_predictions = model.predict(img_array, verbose=0)
        probabilities = raw_predictions[0] if len(raw_predictions.shape) > 1 else raw_predictions

        # 3. Map predictions to classes and database herb records
        scores: List[Dict[str, Any]] = []
        for idx, class_name in enumerate(HERB_CLASSES):
            confidence_val = float(probabilities[idx]) if idx < len(probabilities) else 0.0
            herb = _find_herb_in_db(db, class_name)

            scores.append({
                "herb_id": herb.id if herb else None,
                "name": herb.primary_name if herb else class_name,
                "scientific_name": herb.scientific_name if herb else None,
                "confidence": round(confidence_val, 4),
            })

        # 4. Rank by confidence
        scores.sort(key=lambda x: x["confidence"], reverse=True)
        top_predictions = scores[:3]
        best = top_predictions[0]
        best_confidence = best.get("confidence", 0.0)

        # 5. Evaluate confidence threshold
        if best_confidence < LOW_CONFIDENCE_THRESHOLD:
            status = "low_confidence"
            notes = (
                f"Low confidence ({best_confidence * 100:.1f}%). "
                f"Visually closest to {best['name']}, but please retake photo with clearer lighting and leaf view."
            )
        else:
            status = "completed"
            notes = f"Identified as {best['name']} ({best_confidence * 100:.1f}% confidence) using Farm2Ayur V9 MobileNetV2 model."

        return {
            "predicted_herb_id": best.get("herb_id"),
            "predicted_name": best.get("name"),
            "scientific_name": best.get("scientific_name"),
            "confidence": best_confidence,
            "top_predictions": top_predictions,
            "status": status,
            "notes": notes,
            "model_version": MODEL_VERSION,
        }

    except Exception as e:
        print(f"[AI Scanner] Inference error on {image_path}: {e}")
        return _heuristic_fallback(
            db=db,
            original_filename=original_filename,
            note_prefix=f"Inference error ({str(e)})."
        )