from app.models.user import User
from app.models.herb import (
    Herb,
    HerbName,
    BotanicalClassification,
    HabitatDistribution,
    TraditionalInfo,
    SafetyInfo,
    HerbSource,
)
from app.models.batch import Batch, BatchEvent
from app.models.blockchain import BlockchainRecord
from app.models.chat import KnowledgeDocument, ChatHistory
from app.models.ai_scan import AIScanRecord
from app.models.verification import VerificationRecord

# Convenient aliases
Chat = ChatHistory
AIScan = AIScanRecord

__all__ = [
    "User",
    "Herb",
    "HerbName",
    "BotanicalClassification",
    "HabitatDistribution",
    "TraditionalInfo",
    "SafetyInfo",
    "HerbSource",
    "Batch",
    "BatchEvent",
    "BlockchainRecord",
    "KnowledgeDocument",
    "ChatHistory",
    "Chat",
    "AIScanRecord",
    "AIScan",
    "VerificationRecord",
]
