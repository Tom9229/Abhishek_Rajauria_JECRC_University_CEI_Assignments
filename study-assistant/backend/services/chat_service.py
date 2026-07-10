from services.rag_pipeline import generate_rag_response
from models.schemas import ChatResponse

def process_chat_message(message: str, history: list) -> ChatResponse:
    answer, sources = generate_rag_response(message, history)
    return ChatResponse(answer=answer, sources=sources)
