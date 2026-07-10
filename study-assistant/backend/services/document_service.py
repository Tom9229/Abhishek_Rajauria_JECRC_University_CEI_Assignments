import os
import shutil
import uuid
import json
from datetime import datetime
from fastapi import UploadFile, HTTPException
from utils.parser import extract_text_from_file
from utils.chunker import chunk_documents
from vector_store.chroma_db import add_documents_to_store, delete_document_from_store

UPLOAD_DIR = os.getenv("UPLOADS_DIRECTORY", "./uploads")
METADATA_FILE = os.path.join(UPLOAD_DIR, "metadata.json")

os.makedirs(UPLOAD_DIR, exist_ok=True)

def load_metadata():
    if os.path.exists(METADATA_FILE):
        with open(METADATA_FILE, "r") as f:
            return json.load(f)
    return {}

def save_metadata(metadata):
    with open(METADATA_FILE, "w") as f:
        json.dump(metadata, f, indent=4)

async def process_upload(file: UploadFile):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Empty filename")
    
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".pdf", ".docx", ".pptx", ".txt"]:
        raise HTTPException(status_code=400, detail=f"Unsupported file format: {ext}")
        
    doc_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{doc_id}{ext}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    size = os.path.getsize(file_path)
    
    try:
        pages = extract_text_from_file(file_path)
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to parse document: {str(e)}")
        
    chunks = chunk_documents(pages)
    
    file_metadata = {
        "doc_id": doc_id,
        "filename": file.filename,
        "source": file.filename
    }
    
    try:
        add_documents_to_store(chunks, file_metadata)
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to index document: {str(e)}")
        
    # Update local metadata store
    meta = load_metadata()
    meta[doc_id] = {
        "id": doc_id,
        "filename": file.filename,
        "pages": len(pages),
        "upload_date": datetime.now().isoformat(),
        "size": size
    }
    save_metadata(meta)
    
    return meta[doc_id]

def get_all_documents():
    meta = load_metadata()
    return list(meta.values())

def delete_document(doc_id: str):
    meta = load_metadata()
    if doc_id not in meta:
        raise HTTPException(status_code=404, detail="Document not found")
        
    doc_info = meta[doc_id]
    ext = os.path.splitext(doc_info["filename"])[1].lower()
    file_path = os.path.join(UPLOAD_DIR, f"{doc_id}{ext}")
    
    if os.path.exists(file_path):
        os.remove(file_path)
        
    delete_document_from_store(doc_id)
    
    del meta[doc_id]
    save_metadata(meta)
    return {"message": "Document deleted successfully"}
