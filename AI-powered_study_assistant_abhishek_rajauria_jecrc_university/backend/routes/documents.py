from fastapi import APIRouter
from typing import List
from models.schemas import DocumentResponse
from services.document_service import get_all_documents, delete_document

router = APIRouter()

@router.get("/documents", response_model=List[DocumentResponse])
async def get_documents_route():
    return get_all_documents()

@router.delete("/documents/{doc_id}")
async def delete_document_route(doc_id: str):
    return delete_document(doc_id)

