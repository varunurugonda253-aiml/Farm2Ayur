import os
os.environ['CHAIN_ENABLED'] = 'false'
os.environ['CHAIN_PRIVATE_KEY'] = ''
os.environ['CONTRACT_ADDRESS'] = ''
import os
import sys
from datetime import datetime, timezone
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Ensure backend directory is in path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.database import Base, get_db
from app.main import app
from app.models.user import User
from app.models.herb import Herb
from app.models.batch import Batch
from app.utils.auth import get_current_user

# In-memory SQLite for testing
TEST_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db():
    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def test_users(db):
    verifier = db.query(User).filter(User.email == "verifier@example.com").first()
    if not verifier:
        verifier = User(
            full_name="Dr. Ayurvedic Verifier",
            email="verifier@example.com",
            hashed_password="mock",
            role="verifier",
            is_active=True,
        )
        db.add(verifier)

    collector = db.query(User).filter(User.email == "collector@example.com").first()
    if not collector:
        collector = User(
            full_name="Herbal Collector",
            email="collector@example.com",
            hashed_password="mock",
            role="collector",
            is_active=True,
        )
        db.add(collector)

    db.commit()
    db.refresh(verifier)
    db.refresh(collector)
    return {"verifier": verifier, "collector": collector}


@pytest.fixture
def test_herb(db):
    herb = db.query(Herb).filter(Herb.herb_code == "HERB-TULSI-001").first()
    if not herb:
        herb = Herb(
            herb_code="HERB-TULSI-001",
            primary_name="Tulsi",
            scientific_name="Ocimum sanctum",
            english_name="Holy Basil",
        )
        db.add(herb)
        db.commit()
        db.refresh(herb)
    return herb


@pytest.fixture
def test_batch(db, test_users, test_herb):
    collector = test_users["collector"]
    batch = Batch(
        batch_code="BATCH-TULSI-TEST-001",
        herb_id=test_herb.id,
        collector_id=collector.id,
        harvest_date=datetime.now(timezone.utc),
        harvest_location="Wayanad Organic Farm",
        latitude=11.6854,
        longitude=76.1320,
        quantity_kg=120.0,
        status="harvested",
        notes="High-potency organic tulsi batch",
    )
    db.add(batch)
    db.commit()
    db.refresh(batch)
    return batch


@pytest.fixture
def client(db, test_users):
    verifier = test_users["verifier"]

    def override_get_db():
        try:
            yield db
        finally:
            pass

    def override_get_current_user():
        return verifier

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()

