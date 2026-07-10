import os
from langchain_google_genai import ChatGoogleGenerativeAI
from vector_store.chroma_db import get_vector_store
from prompts.prompt_manager import get_rag_prompt
from dotenv import load_dotenv

load_dotenv()

def get_llm():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is missing")
    return ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key, temperature=float(os.getenv("TEMPERATURE", 0.0)))

def generate_rag_response(query: str, history: list = None) -> tuple:
    vector_store = get_vector_store()
    
    # Retrieve top chunks
    top_k = int(os.getenv("TOP_K_RETRIEVAL", 5))
    
    # Simple similarity search
    results = vector_store.similarity_search(query, k=top_k)
    
    if not results:
        return "I couldn't find that information in the uploaded study materials.", []
        
    context = "\n\n".join([f"Source: {doc.metadata.get('filename', 'Unknown')}, Page: {doc.metadata.get('page', 'Unknown')}\n{doc.page_content}" for doc in results])
    
    prompt_template = get_rag_prompt()
    prompt = prompt_template.format(context=context, question=query)
    
    llm = get_llm()
    response = llm.invoke(prompt)
    
    # Extract unique sources
    sources = []
    seen = set()
    for doc in results:
        src = f"{doc.metadata.get('filename', 'Unknown')} (Page {doc.metadata.get('page', 'Unknown')})"
        if src not in seen:
            seen.add(src)
            sources.append({
                "filename": doc.metadata.get("filename", "Unknown"),
                "page": doc.metadata.get("page", "Unknown")
            })
            
    return response.content, sources
