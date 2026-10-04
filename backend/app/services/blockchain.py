import hashlib
import json
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from sqlalchemy.orm import Session
from app.models.batch import Batch, BatchEvent
from app.models.blockchain import BlockchainRecord

def _canonical_json(data: Dict[str, Any]) -> str:
    return json.dumps(data, sort_keys=True, separators=(",", ":"), default=str)

def sha256_hex(data: Dict[str, Any]) -> str:
    raw = _canonical_json(data).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()

def mock_broadcast(data_hash: str) -> Dict[str, str]:
    tx = "0x" + hashlib.sha256(f"{data_hash}:{uuid.uuid4().hex}".encode()).hexdigest()
    return {
        "network": "mock-chain",
        "transaction_hash": tx,
        "wallet_address": "0xAYUR-MOCK-WALLET",
        "status": "anchored",
    }

def build_batch_payload(batch: Batch) -> Dict[str, Any]:
    events = []
    for e in (batch.events or []):
        events.append({
            "id": e.id,
            "event_type": e.event_type,
            "event_notes": e.event_notes,
            "location": e.location,
            "event_timestamp": e.event_timestamp.isoformat() if e.event_timestamp else None,
            "performed_by": e.performed_by,
            "blockchain_tx_hash": e.blockchain_tx_hash,
        })

    return {
        "batch_code": batch.batch_code,
        "herb_id": batch.herb_id,
        "collector_id": batch.collector_id,
        "harvest_date": batch.harvest_date.isoformat() if batch.harvest_date else None,
        "harvest_location": batch.harvest_location,
        "latitude": float(batch.latitude) if batch.latitude is not None else None,
        "longitude": float(batch.longitude) if batch.longitude is not None else None,
        "quantity_kg": float(batch.quantity_kg) if batch.quantity_kg is not None else None,
        "status": batch.status,
        "notes": batch.notes,
        "events": events,
        "anchored_at": datetime.now(timezone.utc).isoformat(),
    }

def get_previous_hash(db: Session, batch_id: int) -> Optional[str]:
    prev = (
        db.query(BlockchainRecord)
        .filter(BlockchainRecord.batch_id == batch_id)
        .order_by(BlockchainRecord.id.desc())
        .first()
    )
    return prev.data_hash if prev else None

def anchor_batch(
    db: Session,
    batch: Batch,
    record_type: str = "batch_anchor",
    batch_event_id: Optional[int] = None,
    notes: Optional[str] = None,
) -> BlockchainRecord:
    payload = build_batch_payload(batch)
    if batch_event_id:
        payload["anchor_event_id"] = batch_event_id

    previous_hash = get_previous_hash(db, batch.id)
    payload["previous_hash"] = previous_hash

    data_hash = sha256_hex(payload)
    broadcast = mock_broadcast(data_hash)

    record = BlockchainRecord(
        batch_id=batch.id,
        batch_event_id=batch_event_id,
        record_type=record_type,
        data_payload=payload,
        data_hash=data_hash,
        previous_hash=previous_hash,
        network=broadcast["network"],
        transaction_hash=broadcast["transaction_hash"],
        wallet_address=broadcast["wallet_address"],
        status=broadcast["status"],
        notes=notes or "Anchored via hackathon mock-chain service",
    )
    db.add(record)

    if batch_event_id:
        event = db.query(BatchEvent).filter(BatchEvent.id == batch_event_id).first()
        if event:
            event.blockchain_tx_hash = broadcast["transaction_hash"]
    else:
        chain_event = BatchEvent(
            batch_id=batch.id,
            event_type="note",
            event_notes=f"Blockchain anchor created: {data_hash[:12]}...",
            location=None,
            blockchain_tx_hash=broadcast["transaction_hash"],
        )
        db.add(chain_event)

    db.commit()
    db.refresh(record)
    return record

def verify_batch_records(db: Session, batch: Batch) -> Dict[str, Any]:
    records = (
        db.query(BlockchainRecord)
        .filter(BlockchainRecord.batch_id == batch.id)
        .order_by(BlockchainRecord.id.asc())
        .all()
    )
    if not records:
        return {
            "is_valid": False,
            "checks": {"records_found": 0},
            "message": "No blockchain records found for this batch",
            "latest_record": None,
        }

    hash_ok = True
    link_ok = True
    prev = None
    details = []

    for r in records:
        recalculated = sha256_hex(r.data_payload)
        match = recalculated == r.data_hash
        if not match:
            hash_ok = False

        if r.previous_hash != prev:
            if not (prev is None and r.previous_hash is None):
                link_ok = False

        details.append({
            "id": r.id,
            "data_hash": r.data_hash,
            "recalculated_hash": recalculated,
            "hash_match": match,
            "previous_hash": r.previous_hash,
            "tx": r.transaction_hash,
        })
        prev = r.data_hash

    is_valid = hash_ok and link_ok
    return {
        "is_valid": is_valid,
        "checks": {
            "records_found": len(records),
            "hash_integrity_ok": hash_ok,
            "chain_link_ok": link_ok,
            "details": details,
        },
        "message": "Blockchain integrity verified" if is_valid else "Integrity check failed",
        "latest_record": records[-1],
    }