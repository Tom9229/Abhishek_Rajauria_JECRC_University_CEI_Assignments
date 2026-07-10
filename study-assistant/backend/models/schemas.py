from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

class ChatResponse(BaseModel):
    answer: str
    sources: List[dict] = []

class DocumentResponse(BaseModel):
    id: str
    filename: str
    pages: int
    upload_date: str
    size: int

class SettingsUpdate(BaseModel):
    chunk_size: Optional[int] = None
    chunk_overlap: Optional[int] = None
    top_k_retrieval: Optional[int] = None
    temperature: Optional[float] = None
    embedding_model: Optional[str] = None
    llm_provider: Optional[str] = None
