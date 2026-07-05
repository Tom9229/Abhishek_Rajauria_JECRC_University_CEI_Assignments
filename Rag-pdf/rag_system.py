import os
import argparse
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

def main():
    # IMPORTANT: Never hardcode your API key when uploading to GitHub!
    # We are loading it from the local .env file (which is ignored by Git).
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        pass

    # Make sure GOOGLE_API_KEY is set
    if "GOOGLE_API_KEY" not in os.environ:
        print("Error: GOOGLE_API_KEY environment variable is not set.")
        print("Please set it using:")
        print("  $env:GOOGLE_API_KEY=\"your_api_key\"")
        return

    # Parse arguments for query
    parser = argparse.ArgumentParser(description="Query the PDF using RAG.")
    parser.add_argument(
        "--query", 
        type=str, 
        default="What is this document about?", 
        help="Question to ask based on the PDF"
    )
    args = parser.parse_args()
    
    pdf_path = "Week7_Project.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"Error: Could not find {pdf_path} in the current directory.")
        return

    print(f"Loading document: {pdf_path}...")
    try:
        loader = PyPDFLoader(pdf_path)
        docs = loader.load()
    except Exception as e:
        print(f"Failed to load PDF: {e}")
        return

    print("Splitting document into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(docs)

    print("Creating vector store with Google GenAI Embeddings (this might take a moment)...")
    # Using 'models/gemini-embedding-2' as the correct model name for embeddings in the new SDK
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2")
    
    # Let's persist it locally to speed up subsequent runs
    persist_directory = "./chroma_db"
    vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings, persist_directory=persist_directory)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

    print("Initializing Google Gemini Model...")
    # Initialize the LLM (Gemini 3.5 Flash is fast and cheap)
    llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash", temperature=0)

    # Set up the prompt template
    system_prompt = (
        "You are an assistant for question-answering tasks. "
        "Use the following pieces of retrieved context to answer the question. "
        "If you don't know the answer, say that you don't know. "
        "Use three sentences maximum and keep the answer concise."
        "\n\n"
        "{context}"
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])

    print("Building Retrieval Chain...")
    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)

    print(f"\nQuestion: {args.query}")
    print("Generating answer...\n")
    
    response = rag_chain.invoke({"input": args.query})
    
    print("--- Answer ---")
    print(response["answer"])
    print("--------------")

if __name__ == "__main__":
    main()
