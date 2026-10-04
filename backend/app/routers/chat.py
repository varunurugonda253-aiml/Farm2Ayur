from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.chat import ChatHistory, KnowledgeDocument
from app.schemas.chat import (
    ChatQueryRequest, ChatQueryResponse,
    KnowledgeDocCreate, KnowledgeDocResponse
)
from app.services.rag_engine import generate_rag_response
from app.utils.auth import get_current_user, require_roles

router = APIRouter(prefix="/chat", tags=["RAG Chatbot System"])


@router.post(
    "/query",
    response_model=ChatQueryResponse,
    status_code=status.HTTP_200_OK,
    summary="Ask AI Chatbot (RAG over Ayurvedic Knowledge Base)"
)
def chat_query(
    payload: ChatQueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    rag_result = generate_rag_response(db, payload.message)

    history_record = ChatHistory(
        user_id=current_user.id,
        session_id=payload.session_id or "default-session",
        user_message=payload.message,
        bot_response=rag_result["response"],
        retrieved_sources=rag_result["sources"]
    )
    db.add(history_record)
    db.commit()
    db.refresh(history_record)

    return {
        "session_id": history_record.session_id,
        "user_message": history_record.user_message,
        "bot_response": history_record.bot_response,
        "sources": rag_result["sources"],
        "created_at": history_record.created_at
    }

@router.get(
    "/history",
    response_model=List[ChatQueryResponse],
    summary="Get user chat history"
)
def get_chat_history(
    session_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(ChatHistory).filter(ChatHistory.user_id == current_user.id)
    if session_id:
        q = q.filter(ChatHistory.session_id == session_id)

    rows = q.order_by(ChatHistory.created_at.desc()).offset(skip).limit(limit).all()
    
    return [
        {
            "session_id": r.session_id,
            "user_message": r.user_message,
            "bot_response": r.bot_response,
            "sources": r.retrieved_sources or [],
            "created_at": r.created_at
        }
        for r in rows
    ]

@router.post(
    "/knowledge",
    response_model=KnowledgeDocResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a document to verified knowledge base (admin/verifier)"
)
def add_knowledge_doc(
    payload: KnowledgeDocCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "verifier")),
):
    doc = KnowledgeDocument(
        title=payload.title,
        content=payload.content,
        herb_id=payload.herb_id,
        category=payload.category or "ayurvedic_text",
        source_name=payload.source_name,
        source_url=payload.source_url,
        is_verified=True
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc