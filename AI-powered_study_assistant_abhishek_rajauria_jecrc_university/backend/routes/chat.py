from fastapi import APIRouter
from models.schemas import ChatRequest, ChatResponse
from services.chat_service import process_chat_message

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    return process_chat_message(request.message, request.history)
