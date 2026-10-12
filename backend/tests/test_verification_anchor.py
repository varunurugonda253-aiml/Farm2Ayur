from datetime import datetime, timezone
from unittest.mock import patch, MagicMock

import pytest

from app.models.batch import Batch, BatchEvent
from app.models.blockchain import BlockchainRecord
from app.models.verification import VerificationRecord
from app.services.blockchain import verify_batch_on_chain, anchor_batch


def test_approved_batch_anchors(client, db, test_batch):
    """
    1. Approved batch anchors:
    When target_type == 'batch' and decision == 'approved',
    anchor_batch() is called, the batch is anchored, and status is verified.
    """
    mock_anchor_record = BlockchainRecord(
        id=101,
        batch_id=test_batch.id,
        record_type="batch_anchor",
        data_payload={"batch_code": test_batch.batch_code},
        data_hash="0x111122223333444455556666777788889999aaaabbbbccccddddeeeeffff0000",
        network="chain-id-31337",
        transaction_hash="0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        wallet_address="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        status="anchored",
        notes="Auto-anchored on verification approval",
    )

    with patch(
        "app.routers.verification.anchor_batch", return_value=mock_anchor_record
    ) as mock_anchor, patch(
        "app.routers.verification.has_on_chain_anchor", return_value=False
    ):

        payload = {
            "target_type": "batch",
            "target_id": test_batch.id,
            "decision": "approved",
            "confidence_score": 0.98,
            "comments": "Lab purity test passed 99%",
        }

        response = client.post("/verification/", json=payload)
        assert response.status_code == 201

        data = response.json()
        assert data["decision"] == "approved"
        assert data["batch_id"] == test_batch.id
        assert data["blockchain_status"] == "anchored"
        assert "chain-id-31337" in data["anchor_note"]
        assert mock_anchor_record.transaction_hash in data["anchor_note"]

        # Verify anchor_batch was called
        mock_anchor.assert_called_once()

        # Verify verification record exists in DB
        v_record = (
            db.query(VerificationRecord)
            .filter(VerificationRecord.batch_id == test_batch.id)
            .first()
        )
        assert v_record is not None
        assert v_record.decision == "approved"

        # Verify batch status transitioned to verified
        db.refresh(test_batch)
        assert test_batch.status == "verified"


def test_rejected_batch_does_not_anchor(client, db, test_batch):
    """
    2. Rejected batch doesn't anchor:
    When decision == 'rejected', anchor_batch() is NOT called.
    """
    with patch("app.routers.verification.anchor_batch") as mock_anchor:
        payload = {
            "target_type": "batch",
            "target_id": test_batch.id,
            "decision": "rejected",
            "confidence_score": 0.35,
            "comments": "High moisture content and impurities found",
        }

        response = client.post("/verification/", json=payload)
        assert response.status_code == 201

        data = response.json()
        assert data["decision"] == "rejected"
        assert data["blockchain_status"] is None

        # Verify anchor_batch was NOT called
        mock_anchor.assert_not_called()

        # Batch status should be rejected
        db.refresh(test_batch)
        assert test_batch.status == "rejected"


def test_non_batch_target_does_not_anchor(client, db, test_herb):
    """
    3. Non-batch target doesn't anchor:
    When target_type == 'herb' (or any non-batch target), anchor_batch() is NOT called.
    """
    with patch("app.routers.verification.anchor_batch") as mock_anchor:
        payload = {
            "target_type": "herb",
            "target_id": test_herb.id,
            "decision": "approved",
            "confidence_score": 1.0,
            "comments": "Botanical taxonomy verified against Ayurvedic Pharmacopoeia",
        }

        response = client.post("/verification/", json=payload)
        assert response.status_code == 201

        data = response.json()
        assert data["decision"] == "approved"
        assert data["target_type"] == "herb"
        assert data["blockchain_status"] is None

        # Verify anchor_batch was NOT called
        mock_anchor.assert_not_called()


def test_anchor_failure_is_handled(client, db, test_batch):
    """
    4. Anchor failure is handled:
    If anchoring fails, the verification record is KEPT, the batch is NOT reported
    as anchored, and a clear note is returned in the response with NO 500 error.
    """
    error_msg = "Hardhat node connection refused on port 8545"

    with patch(
        "app.routers.verification.anchor_batch",
        side_effect=ConnectionError(error_msg),
    ) as mock_anchor, patch(
        "app.routers.verification.has_on_chain_anchor", return_value=False
    ):

        payload = {
            "target_type": "batch",
            "target_id": test_batch.id,
            "decision": "approved",
            "confidence_score": 0.95,
            "comments": "Approved by senior verifier",
        }

        response = client.post("/verification/", json=payload)

        # Must NOT return a 500 internal server error
        assert response.status_code == 201

        data = response.json()
        # Must not report as anchored
        assert data["blockchain_status"] != "anchored"
        assert data["blockchain_status"] == "failed"

        # Must return clear note in the response
        assert "failed" in data["anchor_note"].lower()
        assert error_msg in data["anchor_note"]

        # Verification record must still be saved in DB
        v_record = (
            db.query(VerificationRecord)
            .filter(
                VerificationRecord.batch_id == test_batch.id,
                VerificationRecord.decision == "approved",
            )
            .first()
        )
        assert v_record is not None
        assert v_record.decision == "approved"


def test_retry_skips_duplicate_anchor(client, db, test_batch):
    """
    Retry skip:
    If the batch already has an on-chain anchor, retrying verification approval
    skips anchoring so duplicate errors / 400s are avoided.
    """
    with patch(
        "app.routers.verification.has_on_chain_anchor", return_value=True
    ), patch(
        "app.routers.verification.anchor_batch"
    ) as mock_anchor:

        payload = {
            "target_type": "batch",
            "target_id": test_batch.id,
            "decision": "approved",
            "comments": "Re-verifying previously approved batch",
        }

        response = client.post("/verification/", json=payload)
        assert response.status_code == 201

        data = response.json()
        assert data["blockchain_status"] == "already_anchored"
        assert "already" in data["anchor_note"].lower()
        mock_anchor.assert_not_called()


def test_modified_batch_is_detected(client, db, test_batch):
    """
    5. Modified batch is detected:
    Extend verify-chain so it rebuilds the hash from CURRENT batch data and compares
    it with the on-chain hash. Reports one of:
      - 'verified'
      - 'modified-since-anchor'
      - 'not-anchored'
      - 'mock-anchored'
    """
    # 5.1 Case: not-anchored
    res_not_anchored = verify_batch_on_chain(db, test_batch)
    assert res_not_anchored["status"] == "not-anchored"
    assert res_not_anchored["match"] is False

    # 5.2 Case: mock-anchored
    mock_record = anchor_batch(db, test_batch, notes="Mock anchoring")
    res_mock = verify_batch_on_chain(db, test_batch)
    assert res_mock["status"] == "mock-anchored"
    assert res_mock["match"] is False

    # 5.3 Case: on-chain verified (unmodified batch)
    on_chain_hash_str = mock_record.data_hash
    on_chain_hex = f"0x{on_chain_hash_str}" if not on_chain_hash_str.startswith("0x") else on_chain_hash_str
    on_chain_bytes = bytes.fromhex(on_chain_hex[2:])

    mock_contract = MagicMock()
    mock_contract.functions.batchExists(test_batch.batch_code).call.return_value = True
    mock_contract.functions.getBatch(test_batch.batch_code).call.return_value = (
        test_batch.batch_code,
        on_chain_bytes,
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        1700000000,
    )

    with patch("app.services.blockchain.get_chain_config", return_value={
        "rpc_url": "http://127.0.0.1:8545",
        "contract_address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        "enabled": True,
        "private_key": "0xmock",
    }), patch("web3.Web3.is_connected", return_value=True), patch(
        "web3.eth.Eth.contract", return_value=mock_contract
    ):
        # Unmodified batch -> verified
        res_verified = verify_batch_on_chain(db, test_batch)
        assert res_verified["status"] == "verified"
        assert res_verified["match"] is True

        # Test via HTTP endpoint
        http_resp = client.get(f"/blockchain/verify-chain/{test_batch.id}")
        assert http_resp.status_code == 200
        http_data = http_resp.json()
        assert http_data["status"] == "verified"
        assert http_data["match"] is True

        # 5.4 Case: modified-since-anchor (tampering detected!)
        # Modify the batch in the database (e.g. quantity tampered from 120.0 to 999.0)
        test_batch.quantity_kg = 999.0
        test_batch.notes = "Tampered notes after anchoring"
        db.commit()
        db.refresh(test_batch)

        res_tampered = verify_batch_on_chain(db, test_batch)
        assert res_tampered["status"] == "modified-since-anchor"
        assert res_tampered["match"] is False
        assert "tampering detected" in res_tampered["message"].lower() or "modified" in res_tampered["message"].lower()

        # Test via HTTP endpoint
        http_tampered_resp = client.get(f"/blockchain/verify-chain/{test_batch.id}")
        assert http_tampered_resp.status_code == 200
        http_tampered_data = http_tampered_resp.json()
        assert http_tampered_data["status"] == "modified-since-anchor"
        assert http_tampered_data["match"] is False


def test_event_added_and_status_changed_after_anchor_remains_verified(client, db, test_batch):
    """
    Legitimate post-anchor events and status changes must NOT cause modified-since-anchor.
    Should return status 'verified' and events_after_anchor: N.
    """
    # 1. Add an initial pre-anchor event
    ev1 = BatchEvent(
        batch_id=test_batch.id,
        event_type="harvest",
        event_notes="Harvested in field",
        location="Farm Block A",
        performed_by=test_batch.collector_id,
    )
    db.add(ev1)
    db.commit()
    db.refresh(test_batch)

    # 2. Anchor the batch
    anchor_record = anchor_batch(db, test_batch, notes="Anchored at approval")
    on_chain_hex = f"0x{anchor_record.data_hash}" if not anchor_record.data_hash.startswith("0x") else anchor_record.data_hash
    on_chain_bytes = bytes.fromhex(on_chain_hex[2:])

    mock_contract = MagicMock()
    mock_contract.functions.batchExists(test_batch.batch_code).call.return_value = True
    mock_contract.functions.getBatch(test_batch.batch_code).call.return_value = (
        test_batch.batch_code,
        on_chain_bytes,
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        1700000000,
    )

    with patch("app.services.blockchain.get_chain_config", return_value={
        "rpc_url": "http://127.0.0.1:8545",
        "contract_address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        "enabled": True,
        "private_key": "0xmock",
    }), patch("web3.Web3.is_connected", return_value=True), patch(
        "web3.eth.Eth.contract", return_value=mock_contract
    ):
        # Initial check right after anchor
        res_initial = verify_batch_on_chain(db, test_batch)
        assert res_initial["status"] == "verified"
        assert res_initial["match"] is True
        assert res_initial["events_after_anchor"] == 0

        # 3. Add legitimate later event and status change
        ev2 = BatchEvent(
            batch_id=test_batch.id,
            event_type="shipped",
            event_notes="Dispatched to processing plant via courier",
            location="Highway Transit",
            performed_by=test_batch.collector_id,
        )
        db.add(ev2)
        test_batch.status = "in_transit"
        db.commit()
        db.refresh(test_batch)

        # Service level verification
        res_later = verify_batch_on_chain(db, test_batch)
        assert res_later["status"] == "verified"
        assert res_later["match"] is True
        assert res_later["events_after_anchor"] == 1

        # API endpoint verification
        http_resp = client.get(f"/blockchain/verify-chain/{test_batch.id}")
        assert http_resp.status_code == 200
        data = http_resp.json()
        assert data["status"] == "verified"
        assert data["match"] is True
        assert data["events_after_anchor"] == 1

        # 4. Add another legitimate event (delivered) and status change
        ev3 = BatchEvent(
            batch_id=test_batch.id,
            event_type="delivered",
            event_notes="Delivered to extraction facility",
            location="Ayur Labs Pune",
            performed_by=test_batch.collector_id,
        )
        db.add(ev3)
        test_batch.status = "delivered"
        db.commit()
        db.refresh(test_batch)

        res_delivered = verify_batch_on_chain(db, test_batch)
        assert res_delivered["status"] == "verified"
        assert res_delivered["match"] is True
        assert res_delivered["events_after_anchor"] == 2

        http_resp2 = client.get(f"/blockchain/verify-chain/{test_batch.id}")
        assert http_resp2.status_code == 200
        assert http_resp2.json()["events_after_anchor"] == 2


def test_quantity_edited_detected_as_tampered(client, db, test_batch):
    """
    Editing an anchored core field (e.g. quantity_kg) must return modified-since-anchor.
    """
    anchor_record = anchor_batch(db, test_batch, notes="Anchored at approval")
    on_chain_hex = f"0x{anchor_record.data_hash}" if not anchor_record.data_hash.startswith("0x") else anchor_record.data_hash
    on_chain_bytes = bytes.fromhex(on_chain_hex[2:])

    mock_contract = MagicMock()
    mock_contract.functions.batchExists(test_batch.batch_code).call.return_value = True
    mock_contract.functions.getBatch(test_batch.batch_code).call.return_value = (
        test_batch.batch_code,
        on_chain_bytes,
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        1700000000,
    )

    with patch("app.services.blockchain.get_chain_config", return_value={
        "rpc_url": "http://127.0.0.1:8545",
        "contract_address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        "enabled": True,
        "private_key": "0xmock",
    }), patch("web3.Web3.is_connected", return_value=True), patch(
        "web3.eth.Eth.contract", return_value=mock_contract
    ):
        # Core field quantity_kg edited after anchor
        test_batch.quantity_kg = 50.0
        db.commit()
        db.refresh(test_batch)

        res = verify_batch_on_chain(db, test_batch)
        assert res["status"] == "modified-since-anchor"
        assert res["match"] is False

        http_resp = client.get(f"/blockchain/verify-chain/{test_batch.id}")
        assert http_resp.status_code == 200
        data = http_resp.json()
        assert data["status"] == "modified-since-anchor"
        assert data["match"] is False


def test_pre_anchor_event_altered_detected_as_tampered(client, db, test_batch):
    """
    Altering an event that existed at anchor time must return modified-since-anchor.
    """
    ev = BatchEvent(
        batch_id=test_batch.id,
        event_type="harvest",
        event_notes="Original harvest notes at anchor time",
        location="Farm Block A",
        performed_by=test_batch.collector_id,
    )
    db.add(ev)
    db.commit()
    db.refresh(test_batch)

    anchor_record = anchor_batch(db, test_batch, notes="Anchored at approval")
    on_chain_hex = f"0x{anchor_record.data_hash}" if not anchor_record.data_hash.startswith("0x") else anchor_record.data_hash
    on_chain_bytes = bytes.fromhex(on_chain_hex[2:])

    mock_contract = MagicMock()
    mock_contract.functions.batchExists(test_batch.batch_code).call.return_value = True
    mock_contract.functions.getBatch(test_batch.batch_code).call.return_value = (
        test_batch.batch_code,
        on_chain_bytes,
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        1700000000,
    )

    with patch("app.services.blockchain.get_chain_config", return_value={
        "rpc_url": "http://127.0.0.1:8545",
        "contract_address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        "enabled": True,
        "private_key": "0xmock",
    }), patch("web3.Web3.is_connected", return_value=True), patch(
        "web3.eth.Eth.contract", return_value=mock_contract
    ):
        # Alter the pre-anchor event
        ev.event_notes = "Tampered harvest note: changed pesticide info"
        db.commit()
        db.refresh(test_batch)

        res = verify_batch_on_chain(db, test_batch)
        assert res["status"] == "modified-since-anchor"
        assert res["match"] is False

        http_resp = client.get(f"/blockchain/verify-chain/{test_batch.id}")
        assert http_resp.status_code == 200
        data = http_resp.json()
        assert data["status"] == "modified-since-anchor"
        assert data["match"] is False


def test_pre_anchor_event_deleted_detected_as_tampered(client, db, test_batch):
    """
    Deleting an event that existed at anchor time must return modified-since-anchor.
    """
    ev = BatchEvent(
        batch_id=test_batch.id,
        event_type="harvest",
        event_notes="Original harvest notes to be deleted",
        location="Farm Block A",
        performed_by=test_batch.collector_id,
    )
    db.add(ev)
    db.commit()
    db.refresh(test_batch)

    anchor_record = anchor_batch(db, test_batch, notes="Anchored at approval")
    on_chain_hex = f"0x{anchor_record.data_hash}" if not anchor_record.data_hash.startswith("0x") else anchor_record.data_hash
    on_chain_bytes = bytes.fromhex(on_chain_hex[2:])

    mock_contract = MagicMock()
    mock_contract.functions.batchExists(test_batch.batch_code).call.return_value = True
    mock_contract.functions.getBatch(test_batch.batch_code).call.return_value = (
        test_batch.batch_code,
        on_chain_bytes,
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        1700000000,
    )

    with patch("app.services.blockchain.get_chain_config", return_value={
        "rpc_url": "http://127.0.0.1:8545",
        "contract_address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        "enabled": True,
        "private_key": "0xmock",
    }), patch("web3.Web3.is_connected", return_value=True), patch(
        "web3.eth.Eth.contract", return_value=mock_contract
    ):
        # Delete pre-anchor event
        db.delete(ev)
        db.commit()
        db.refresh(test_batch)

        res = verify_batch_on_chain(db, test_batch)
        assert res["status"] == "modified-since-anchor"
        assert res["match"] is False

        http_resp = client.get(f"/blockchain/verify-chain/{test_batch.id}")
        assert http_resp.status_code == 200
        data = http_resp.json()
        assert data["status"] == "modified-since-anchor"
        assert data["match"] is False

