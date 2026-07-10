from fastapi import APIRouter
from models.schemas import SettingsUpdate

router = APIRouter()

@router.post("/settings")
async def update_settings(settings: SettingsUpdate):
    return {"message": "Settings updated"}

@router.get("/settings")
async def get_settings():
    return {
        "chunk_size": 500,
        "chunk_overlap": 100,
        "top_k_retrieval": 5,
        "temperature": 0.0,
        "embedding_model": "BAAI/bge-small-en-v1.5",
        "llm_provider": "gemini"
    }
