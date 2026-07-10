from langchain_text_splitters import RecursiveCharacterTextSplitter

def get_text_splitter(chunk_size: int = 500, chunk_overlap: int = 100):
    return RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ".", " ", ""],
        length_function=len,
    )

def chunk_documents(pages: list, chunk_size: int = 500, chunk_overlap: int = 100):
    splitter = get_text_splitter(chunk_size, chunk_overlap)
    chunks = []
    
    for page in pages:
        texts = splitter.split_text(page["page_content"])
        for i, text in enumerate(texts):
            chunk_metadata = page["metadata"].copy()
            chunk_metadata["chunk_index"] = i
            chunks.append({
                "page_content": text,
                "metadata": chunk_metadata
            })
            
    return chunks
