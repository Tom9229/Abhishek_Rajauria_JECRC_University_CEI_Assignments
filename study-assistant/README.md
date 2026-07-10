# AI-Powered Study Assistant

A full-stack RAG (Retrieval-Augmented Generation) application to upload study documents and chat with them using Google Gemini AI.

## Architecture

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Query.
- **Backend:** FastAPI, LangChain, ChromaDB, HuggingFace Embeddings, PyMuPDF, Python-Docx, PPTX.
- **LLM:** Google Gemini 1.5 Pro.

## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.10+
- Google Gemini API Key

### 1. Clone the Repository

```bash
git clone https://github.com/Tom9229/Abhishek_Rajauria_JECRC_University_CEI_Assignments.git
cd Abhishek_Rajauria_JECRC_University_CEI_Assignments/study-assistant
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create your `.env` file from `.env.example` and add your Gemini API Key:
   ```bash
   cp .env.example .env
   ```
5. Run the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Features

- **Document Parsing:** Upload PDF, DOCX, PPTX, or TXT files.
- **Semantic Search:** Uses `BAAI/bge-small-en-v1.5` for accurate local text embeddings.
- **Vector Database:** Uses ChromaDB with local persistence.
- **RAG Chat:** Strictly answers from context using Gemini and provides source citations.
- **Settings:** Fine-tune chunking, retrieval Top-K, and temperature.
- **Dark Mode:** Beautiful UI with light and dark mode toggling.
