# Simple RAG System

This project is a Retrieval-Augmented Generation (RAG) system built in Python. It loads a custom PDF document, chunks the text, creates embeddings using Google's generative models, stores them in a local Chroma vector database, and uses the Gemini model to answer user questions based on the document.

## Setup Instructions

### 1. Prerequisites
- Python 3.9+
- A Google API Key ([Get one here](https://aistudio.google.com/app/apikey))

### 2. Install Dependencies
Clone this repository and install the required packages:
```bash
pip install -r requirements.txt
```

### 3. Configure API Key
Set your Google API key as an environment variable in your terminal:

**Windows (PowerShell):**
```powershell
$env:GOOGLE_API_KEY="YOUR_API_KEY_HERE"
```

**Mac/Linux:**
```bash
export GOOGLE_API_KEY="YOUR_API_KEY_HERE"
```

### 4. Run the RAG System
Run the script and provide a query using the `--query` flag:
```bash
python rag_system.py --query "What is the main topic of this document?"
```

## How it works
1. **Document Loading**: Uses `PyPDFLoader` to read the PDF.
2. **Chunking**: Uses `RecursiveCharacterTextSplitter` to break the text into manageable pieces.
3. **Embedding**: Uses `models/gemini-embedding-2` to embed the text.
4. **Storage**: Uses `Chroma` to persist the vectors locally.
5. **Generation**: Uses `gemini-3.5-flash` to generate a concise answer based on the retrieved context.
