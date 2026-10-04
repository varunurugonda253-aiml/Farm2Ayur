import re
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.herb import Herb
from app.models.chat import KnowledgeDocument

SAFETY_RULES = (
    "\n\n⚠️ Disclaimer: This platform provides traditional Ayurvedic information "
    "for educational and traceability purposes only. It is not intended as medical "
    "diagnosis, prescription, or treatment. Please consult a qualified Ayurvedic "
    "physician or medical healthcare provider before using herbal remedies."
)

def retrieve_context(db: Session, query: str) -> Dict[str, Any]:
    clean_query = query.lower()
    retrieved_herbs: List[Herb] = []
    retrieved_docs: List[KnowledgeDocument] = []
    sources = []

    all_herbs = db.query(Herb).all()
    for h in all_herbs:
        names_to_check = [
            h.primary_name.lower(),
            (h.sanskrit_name or "").lower(),
            (h.scientific_name or "").lower(),
            (h.english_name or "").lower(),
        ]
        if any(name in clean_query for name in names_to_check if name):
            retrieved_herbs.append(h)
            sources.append({
                "title": f"Herb DB: {h.primary_name} ({h.scientific_name})",
                "type": "herb_database",
                "source_name": h.botanical_family or "Ayurvedic Knowledge Base",
                "url": f"/herbs/code/{h.herb_code}"
            })

    docs = db.query(KnowledgeDocument).filter(KnowledgeDocument.is_verified == True).all()
    for d in docs:
        if d.title.lower() in clean_query or any(word in d.content.lower() for word in clean_query.split() if len(word) > 4):
            retrieved_docs.append(d)
            sources.append({
                "title": d.title,
                "type": "knowledge_doc",
                "source_name": d.source_name or "Verified Ayurvedic Text",
                "url": d.source_url
            })

    return {
        "herbs": retrieved_herbs,
        "docs": retrieved_docs,
        "sources": sources
    }


def generate_rag_response(db: Session, user_message: str) -> Dict[str, Any]:
    context = retrieve_context(db, user_message)
    herbs = context["herbs"]
    docs = context["docs"]
    sources = context["sources"]

    if herbs:
        herb = herbs[0]
        response_text = f"🌿 **{herb.primary_name}** ({herb.scientific_name})\n\n"
        
        if herb.sanskrit_name:
            response_text += f"• **Sanskrit Name:** {herb.sanskrit_name}\n"
        if herb.english_name:
            response_text += f"• **Common English Name:** {herb.english_name}\n"
        if herb.botanical_family:
            response_text += f"• **Botanical Family:** {herb.botanical_family}\n"
        if herb.plant_type:
            response_text += f"• **Plant Form:** {herb.plant_type}\n\n"

        if herb.traditional_info and herb.traditional_info.traditional_uses:
            response_text += f"**Traditional Uses & Significance:**\n{herb.traditional_info.traditional_uses}\n\n"
        elif herb.traditional_info and herb.traditional_info.cultural_importance:
            response_text += f"**Traditional Importance:**\n{herb.traditional_info.cultural_importance}\n\n"

        if herb.habitat and herb.habitat.native_region:
            response_text += f"**Habitat & Distribution:**\nNative to {herb.habitat.native_region}.\n\n"

        if herb.safety_records:
            response_text += "**Safety Information:**\n"
            for s in herb.safety_records[:2]:
                note = s.general_safety_note or "Preparation-specific handling required."
                response_text += f"• *{s.preparation_type.title()}*: {note}\n"

    elif docs:
        doc = docs[0]
        response_text = f"📖 **Information from Verified Knowledge Base ({doc.title}):**\n\n{doc.content}"

    else:
        response_text = (
            f"I searched our verified Ayurvedic Knowledge Base for '{user_message}'.\n\n"
            "Currently, our database has detailed verified records for core herbs like "
            "**Ashwagandha**, **Tulsi**, **Neem**, **Amla**, and **Guduchi**.\n\n"
            "You can ask me questions like:\n"
            "• 'Tell me about Tulsi'\n"
            "• 'What are the safety notes for Ashwagandha?'\n"
            "• 'What family does Neem belong to?'"
        )

    response_text += SAFETY_RULES

    return {
        "response": response_text,
        "sources": sources
    }