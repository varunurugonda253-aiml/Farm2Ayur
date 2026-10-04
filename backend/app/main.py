import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.routers import herbs, auth, batches, uploads, scan, verification, blockchain, admin, chat
from app.database import get_db
from app.models.batch import Batch
from app.schemas.batch import BatchDetailResponse

app = FastAPI(
    title="Ayurvedic Platform API",
    description="Backend for herb identification, batch tracking, AI & blockchain",
    version="1.0.0",
)

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

static_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static")
os.makedirs(os.path.join(static_dir, "qr"), exist_ok=True)
os.makedirs(os.path.join(static_dir, "uploads"), exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.include_router(herbs.router)
app.include_router(auth.router)
app.include_router(batches.router)
app.include_router(uploads.router)
app.include_router(scan.router)
app.include_router(verification.router)
app.include_router(blockchain.router)
app.include_router(admin.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return {
        "message": "Ayurvedic Platform Backend is running!",
        "status": "ok",
        "docs": "/docs",
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/track/{batch_code}", response_model=BatchDetailResponse, tags=["Public Tracking"])
def public_track_batch(batch_code: str, db: Session = Depends(get_db)):
    batch = db.query(Batch).filter(Batch.batch_code == batch_code).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    data = BatchDetailResponse.model_validate(batch).model_dump()
    data["herb_name"] = batch.herb.primary_name if batch.herb else None
    data["collector_name"] = batch.collector.full_name if batch.collector else None
    return data