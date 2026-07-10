from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from services.document_service import process_upload

router = APIRouter()

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    return await process_upload(file)
