import hashlib
import json
import logging
import os
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session
from web3 import Web3
from web3.exceptions import ContractCustomError, ContractLogicError

from app.models.batch import Batch, BatchEvent
from app.models.blockchain import BlockchainRecord

logger = logging.getLogger(__name__)

ABI_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "contracts",
    "HerbTrace.abi.json",
)


class ContractRevertError(HTTPException):
    """Raised when a smart contract call reverts with a reason."""

    def __init__(self, reason: str, status_code: int = 400):
        super().__init__(status_code=status_code, detail=f"Contract reverted: {reason}")
        self.reason = reason


def _load_contract_abi() -> list:
    if os.path.exists(ABI_PATH):
        with open(ABI_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def is_chain_enabled() -> bool:
    return os.getenv("CHAIN_ENABLED", "false").lower() in ("true", "1", "yes")


def get_chain_config() -> Dict[str, Any]:
    return {
        "rpc_url": os.getenv("CHAIN_RPC_URL", "http://127.0.0.1:8545"),
        "private_key": os.getenv("CHAIN_PRIVATE_KEY"),
        "contract_address": os.getenv("CONTRACT_ADDRESS"),
        "enabled": is_chain_enabled(),
    }


def _parse_revert_reason(exc: Exception) -> str:
    """Extract human-readable revert message from Web3 exception."""
    msg = str(exc)
    patterns = [
        "execution reverted: ",
        "reverted with reason string ",
        "revert: ",
        "VM Exception while processing transaction: revert ",
    ]
    extracted = msg
    for pattern in patterns:
        if pattern in msg:
            parts = msg.split(pattern)
            extracted = parts[-1].strip()
            break

    # If extracted contains tuple/list representations like ("Reason", "0x..."), take only the reason text
    for split_token in ["', '0x", "', \"0x", "\", '0x", "\", \"0x", "', b'"]:
        if split_token in extracted:
            extracted = extracted.split(split_token)[0]

    for arg in getattr(exc, "args", []):
        if isinstance(arg, dict):
            m = arg.get("message")
            d = arg.get("data")
            if isinstance(d, dict) and "message" in d:
                return _parse_revert_reason(Exception(d["message"]))
            if m:
                return _parse_revert_reason(Exception(m))
    return extracted.strip("'\" )]}\n\r\t ")


def _canonical_json(data: Dict[str, Any]) -> str:
    return json.dumps(data, sort_keys=True, separators=(",", ":"), default=str)


def sha256_hex(data: Dict[str, Any]) -> str:
    raw = _canonical_json(data).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def mock_broadcast(data_hash: str) -> Dict[str, Any]:
    tx = "0x" + hashlib.sha256(f"{data_hash}:{uuid.uuid4().hex}".encode()).hexdigest()
    return {
        "network": "mock-chain",
        "transaction_hash": tx,
        "wallet_address": "0xAYUR-MOCK-WALLET",
        "status": "anchored",
        "block_number": None,
    }


def real_broadcast(batch_code: str, data_hash: str) -> Dict[str, Any]:
    """
    Broadcasts batch registration to HerbTrace on-chain contract.
    Converts SHA-256 hex hash to bytes32, signs with owner private key,
    waits for receipt, and returns transaction hash and block number.
    """
    cfg = get_chain_config()
    rpc_url = cfg["rpc_url"]
    private_key = cfg["private_key"]
    contract_address = cfg["contract_address"]

    if not private_key:
        raise ValueError("CHAIN_PRIVATE_KEY is not configured")
    if not contract_address:
        raise ValueError("CONTRACT_ADDRESS is not configured")

    w3 = Web3(Web3.HTTPProvider(rpc_url))
    if not w3.is_connected():
        raise ConnectionError(f"Cannot connect to blockchain node at {rpc_url}")

    # Convert hex hash to 32 bytes
    clean_hash = data_hash[2:] if data_hash.startswith("0x") else data_hash
    try:
        hash_bytes = bytes.fromhex(clean_hash)
    except ValueError as e:
        raise ValueError(f"Invalid hex string for data hash: {e}")

    if len(hash_bytes) != 32:
        raise ValueError(f"Data hash must be exactly 32 bytes, got {len(hash_bytes)}")

    abi = _load_contract_abi()
    if not abi:
        raise ValueError("HerbTrace contract ABI not found")

    checksum_address = Web3.to_checksum_address(contract_address)
    contract = w3.eth.contract(address=checksum_address, abi=abi)
    account = w3.eth.account.from_key(private_key)

    # Pre-simulate using call to detect reverts cleanly before submitting
    try:
        contract.functions.registerBatch(batch_code, hash_bytes).call(
            {"from": account.address}
        )
    except (ContractLogicError, ContractCustomError) as e:
        reason = _parse_revert_reason(e)
        logger.warning(f"Contract simulation reverted for batch '{batch_code}': {reason}")
        raise ContractRevertError(reason)
    except Exception as e:
        msg = str(e)
        if "revert" in msg.lower():
            reason = _parse_revert_reason(e)
            raise ContractRevertError(reason)
        # Other errors (e.g. connection issues during call) will bubble up to fallback
        raise

    # Build and sign transaction
    try:
        nonce = w3.eth.get_transaction_count(account.address, "pending")
        gas_price = w3.eth.gas_price
        tx_data = contract.functions.registerBatch(
            batch_code, hash_bytes
        ).build_transaction(
            {
                "from": account.address,
                "nonce": nonce,
                "maxPriorityFeePerGas": w3.to_wei(30, "gwei"),
                "maxFeePerGas": w3.to_wei(60, "gwei"),
                "chainId": w3.eth.chain_id,
            }
        )
    except (ContractLogicError, ContractCustomError) as e:
        reason = _parse_revert_reason(e)
        raise ContractRevertError(reason)
    except Exception as e:
        msg = str(e)
        if "revert" in msg.lower():
            raise ContractRevertError(_parse_revert_reason(e))
        raise

    signed_tx = w3.eth.account.sign_transaction(tx_data, private_key=private_key)
    raw_tx = getattr(
        signed_tx, "raw_transaction", getattr(signed_tx, "rawTransaction", None)
    )

    try:
        tx_hash = w3.eth.send_raw_transaction(raw_tx)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=60)
    except (ContractLogicError, ContractCustomError) as e:
        raise ContractRevertError(_parse_revert_reason(e))
    except Exception as e:
        msg = str(e)
        if "revert" in msg.lower():
            raise ContractRevertError(_parse_revert_reason(e))
        raise

    if receipt.get("status") == 0:
        raise ContractRevertError("Transaction mined but reverted on-chain")

    tx_hash_val = receipt["transactionHash"]
    tx_hash_hex = (
        tx_hash_val.to_0x_hex()
        if hasattr(tx_hash_val, "to_0x_hex")
        else tx_hash_val.hex()
    )
    if not tx_hash_hex.startswith("0x"):
        tx_hash_hex = "0x" + tx_hash_hex

    block_num = receipt.get("blockNumber")

    return {
        "network": f"chain-id-{w3.eth.chain_id}",
        "transaction_hash": tx_hash_hex,
        "wallet_address": account.address,
        "status": "anchored",
        "block_number": block_num,
    }


def build_batch_payload(batch: Batch) -> Dict[str, Any]:
    events = []
    for e in batch.events or []:
        events.append(
            {
                "id": e.id,
                "event_type": e.event_type,
                "event_notes": e.event_notes,
                "location": e.location,
                "event_timestamp": (
                    e.event_timestamp.isoformat() if e.event_timestamp else None
                ),
                "performed_by": e.performed_by,
                "blockchain_tx_hash": e.blockchain_tx_hash,
            }
        )

    return {
        "batch_code": batch.batch_code,
        "herb_id": batch.herb_id,
        "collector_id": batch.collector_id,
        "harvest_date": (
            batch.harvest_date.isoformat() if batch.harvest_date else None
        ),
        "harvest_location": batch.harvest_location,
        "latitude": float(batch.latitude) if batch.latitude is not None else None,
        "longitude": float(batch.longitude) if batch.longitude is not None else None,
        "quantity_kg": (
            float(batch.quantity_kg) if batch.quantity_kg is not None else None
        ),
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

    broadcast: Optional[Dict[str, Any]] = None
    if is_chain_enabled():
        try:
            broadcast = real_broadcast(batch.batch_code, data_hash)
        except ContractRevertError:
            # Re-raise contract reverts directly (requirement 5: not a 500)
            raise
        except Exception as exc:
            # Fallback to mock on RPC / network / configuration failure (requirement 4)
            logger.warning(
                f"Blockchain broadcast failed, falling back to mock: {exc}"
            )
            broadcast = mock_broadcast(data_hash)
    else:
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
        notes=notes
        or (
            f"Anchored on {broadcast['network']}"
            + (
                f" (Block #{broadcast['block_number']})"
                if broadcast.get("block_number")
                else ""
            )
        ),
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


def has_on_chain_anchor(db: Session, batch: Batch) -> bool:
    """
    Checks if the batch already has a confirmed on-chain (non-mock) anchor.
    Checks local DB records first; if chain is enabled, also checks smart contract directly.
    """
    # 1. Check local DB records for a non-mock anchored record
    record = (
        db.query(BlockchainRecord)
        .filter(
            BlockchainRecord.batch_id == batch.id,
            BlockchainRecord.network != "mock-chain",
            BlockchainRecord.status == "anchored",
        )
        .first()
    )
    if record:
        return True

    # 2. Check smart contract directly if chain is enabled
    if is_chain_enabled():
        cfg = get_chain_config()
        if cfg.get("contract_address"):
            try:
                w3 = Web3(Web3.HTTPProvider(cfg["rpc_url"]))
                if w3.is_connected():
                    abi = _load_contract_abi()
                    contract = w3.eth.contract(
                        address=Web3.to_checksum_address(cfg["contract_address"]),
                        abi=abi,
                    )
                    if contract.functions.batchExists(batch.batch_code).call():
                        return True
            except Exception as e:
                logger.debug(f"batchExists check error: {e}")

    return False


def rebuild_batch_hash(
    batch: Batch, reference_payload: Optional[Dict[str, Any]] = None
) -> str:
    """
    Rebuilds the cryptographic SHA-256 data hash from the core fields and pre-anchor events
    in the database to compare against the on-chain anchor hash.
    Preserves fixed anchor metadata (anchored_at timestamp, previous_hash, anchor_event_id,
    and anchored status) from reference_payload if provided.
    """
    if reference_payload:
        current_payload = dict(reference_payload)
        # Use anchored status so legitimate later status changes (e.g. shipped, delivered)
        # do not cause false-positive modified-since-anchor
        current_payload["status"] = reference_payload.get("status", batch.status)
    else:
        current_payload = {
            "anchored_at": None,
            "previous_hash": None,
            "status": batch.status,
        }

    current_payload["batch_code"] = batch.batch_code
    current_payload["herb_id"] = batch.herb_id
    current_payload["collector_id"] = batch.collector_id
    current_payload["harvest_date"] = (
        batch.harvest_date.isoformat() if batch.harvest_date else None
    )
    current_payload["harvest_location"] = batch.harvest_location
    current_payload["latitude"] = (
        float(batch.latitude) if batch.latitude is not None else None
    )
    current_payload["longitude"] = (
        float(batch.longitude) if batch.longitude is not None else None
    )
    current_payload["quantity_kg"] = (
        float(batch.quantity_kg) if batch.quantity_kg is not None else None
    )
    current_payload["notes"] = batch.notes

    # Reconstruct events that existed at anchor time using current DB values
    events = []
    if reference_payload and "events" in reference_payload:
        current_events_by_id = {
            e.id: e for e in (batch.events or []) if e.id is not None
        }
        for i, ev in enumerate(reference_payload["events"]):
            ev_id = ev.get("id")
            curr_e = None
            if ev_id is not None and ev_id in current_events_by_id:
                curr_e = current_events_by_id[ev_id]
            elif ev_id is None and i < len(batch.events or []):
                curr_e = (batch.events or [])[i]

            if curr_e is not None:
                events.append(
                    {
                        "id": curr_e.id,
                        "event_type": curr_e.event_type,
                        "event_notes": curr_e.event_notes,
                        "location": curr_e.location,
                        "event_timestamp": (
                            curr_e.event_timestamp.isoformat()
                            if curr_e.event_timestamp
                            else None
                        ),
                        "performed_by": curr_e.performed_by,
                        "blockchain_tx_hash": curr_e.blockchain_tx_hash,
                    }
                )
            else:
                # Pre-anchor event was deleted from the database
                events.append(
                    {
                        "id": ev_id,
                        "deleted": True,
                    }
                )
    else:
        for e in batch.events or []:
            events.append(
                {
                    "id": e.id,
                    "event_type": e.event_type,
                    "event_notes": e.event_notes,
                    "location": e.location,
                    "event_timestamp": (
                        e.event_timestamp.isoformat()
                        if e.event_timestamp
                        else None
                    ),
                    "performed_by": e.performed_by,
                    "blockchain_tx_hash": e.blockchain_tx_hash,
                }
            )

    current_payload["events"] = events

    return sha256_hex(current_payload)


def verify_batch_on_chain(db: Session, batch: Batch) -> Dict[str, Any]:
    """
    Reads the batch from HerbTrace smart contract and compares its on-chain dataHash
    to the hash rebuilt from the CURRENT batch data in the database.
    Reports one of: 'verified', 'modified-since-anchor', 'not-anchored', 'mock-anchored'.
    """
    latest = (
        db.query(BlockchainRecord)
        .filter(BlockchainRecord.batch_id == batch.id)
        .order_by(BlockchainRecord.id.desc())
        .first()
    )

    current_hash = rebuild_batch_hash(
        batch, reference_payload=latest.data_payload if latest else None
    )
    current_hex = (
        current_hash if current_hash.startswith("0x") else f"0x{current_hash}"
    )
    local_hex = latest.data_hash if latest else ""
    if local_hex and not local_hex.startswith("0x"):
        local_hex = f"0x{local_hex}"

    # Calculate count of legitimate events added after anchor
    anchored_event_ids = (
        {
            ev.get("id")
            for ev in (latest.data_payload.get("events") or [])
            if ev.get("id") is not None
        }
        if (latest and latest.data_payload)
        else set()
    )

    after_anchor_events = [
        e
        for e in (batch.events or [])
        if e.id not in anchored_event_ids
        and not (
            e.event_notes
            and e.event_notes.startswith("Blockchain anchor created:")
        )
    ]
    events_after_anchor = len(after_anchor_events)

    cfg = get_chain_config()
    contract_exists = False
    on_chain_hex = ""
    registered_by = ""
    timestamp = 0

    if cfg["enabled"] and cfg["contract_address"]:
        try:
            w3 = Web3(Web3.HTTPProvider(cfg["rpc_url"]))
            if w3.is_connected():
                abi = _load_contract_abi()
                contract = w3.eth.contract(
                    address=Web3.to_checksum_address(cfg["contract_address"]),
                    abi=abi,
                )
                if contract.functions.batchExists(batch.batch_code).call():
                    contract_exists = True
                    _, on_chain_bytes, registered_by, timestamp = (
                        contract.functions.getBatch(batch.batch_code).call()
                    )
                    on_chain_hex = on_chain_bytes.hex()
                    if not on_chain_hex.startswith("0x"):
                        on_chain_hex = f"0x{on_chain_hex}"
        except Exception as e:
            logger.warning(
                f"Error checking on-chain contract for batch '{batch.batch_code}': {e}"
            )

    # 1. On-chain contract record exists
    if contract_exists:
        match = current_hex.lower() == on_chain_hex.lower()
        if match:
            status = "verified"
            message = "Batch data verified and matches on-chain anchor"
        else:
            status = "modified-since-anchor"
            message = (
                "Batch data has been modified since on-chain anchor (tampering detected)"
            )

        return {
            "batch_id": batch.id,
            "batch_code": batch.batch_code,
            "status": status,
            "match": match,
            "on_chain_hash": on_chain_hex,
            "local_hash": local_hex or on_chain_hex,
            "current_hash": current_hex,
            "events_after_anchor": events_after_anchor,
            "registered_by": registered_by,
            "timestamp": int(timestamp),
            "message": message,
        }

    # 2. Check if batch is mock-anchored locally
    if latest and (
        latest.network == "mock-chain"
        or latest.wallet_address == "0xAYUR-MOCK-WALLET"
    ):
        return {
            "batch_id": batch.id,
            "batch_code": batch.batch_code,
            "status": "mock-anchored",
            "match": False,
            "on_chain_hash": "",
            "local_hash": local_hex,
            "current_hash": current_hex,
            "events_after_anchor": events_after_anchor,
            "registered_by": latest.wallet_address or "0xAYUR-MOCK-WALLET",
            "timestamp": (
                int(latest.created_at.timestamp()) if latest.created_at else 0
            ),
            "message": "Batch is mock-anchored only; not anchored on contract",
        }

    # 3. Batch is not anchored anywhere
    return {
        "batch_id": batch.id,
        "batch_code": batch.batch_code,
        "status": "not-anchored",
        "match": False,
        "on_chain_hash": "",
        "local_hash": local_hex,
        "current_hash": current_hex,
        "events_after_anchor": 0,
        "registered_by": "",
        "timestamp": 0,
        "message": "Batch is not anchored on blockchain",
    }


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

        details.append(
            {
                "id": r.id,
                "data_hash": r.data_hash,
                "recalculated_hash": recalculated,
                "hash_match": match,
                "previous_hash": r.previous_hash,
                "tx": r.transaction_hash,
            }
        )
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
        "message": (
            "Blockchain integrity verified"
            if is_valid
            else "Integrity check failed"
        ),
        "latest_record": records[-1],
    }