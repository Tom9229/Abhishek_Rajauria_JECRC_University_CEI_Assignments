from langchain_community.embeddings import HuggingFaceEmbeddings
import os
from dotenv import load_dotenv

load_dotenv()

def get_embedding_model():
    model_name = os.getenv("EMBEDDING_MODEL", "BAAI/bge-small-en-v1.5")
    # Using HuggingFaceEmbeddings from langchain-community
    embeddings = HuggingFaceEmbeddings(
        model_name=model_name,
        model_kwargs={'device': 'cpu'}, # Use CPU by default, switch to cuda if available
        encode_kwargs={'normalize_embeddings': True}
    )
    return embeddings
