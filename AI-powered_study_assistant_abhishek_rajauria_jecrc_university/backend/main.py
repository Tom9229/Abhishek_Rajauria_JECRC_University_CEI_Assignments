from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import upload, chat, documents, settings

app = FastAPI(title="AI-Powered Study Assistant API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(documents.router, prefix="/api", tags=["Documents"])
app.include_router(settings.router, prefix="/api", tags=["Settings"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI-Powered Study Assistant API!"}
