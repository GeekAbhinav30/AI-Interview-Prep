"""
Resume processing service with RAG (Retrieval Augmented Generation)
"""
import io
import uuid
import time
import threading
from typing import Dict, List, Optional
from PyPDF2 import PdfReader
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from backend.utils.logger import debug_log


# Initialize Sentence Transformer for RAG (lazy loading)
_embedder = None

def get_embedder():
    """Lazy load the embedder to avoid blocking startup"""
    global _embedder
    if _embedder is None:
        debug_log("resume_service.py:get_embedder", "loading_sentence_transformer", {}, "A")
        _embedder = SentenceTransformer("all-MiniLM-L6-v2")
        debug_log("resume_service.py:get_embedder", "sentence_transformer_loaded", {}, "A")
    return _embedder

# Session stores
session_store: Dict[str, dict] = {}
rag_status: Dict[str, dict] = {}

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF file"""
    reader = PdfReader(io.BytesIO(file_bytes))
    return "\n".join(page.extract_text() or "" for page in reader.pages)

def chunk_text(text: str, chunk_size: int = 500) -> List[str]:
    """Split text into chunks"""
    words = text.split()
    return [" ".join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

def process_resume_background(session_id: str):
    """
    Process resume in background thread - generate embeddings and create FAISS index
    This runs in a separate thread to avoid blocking the API
    """
    # #region agent log
    debug_log("resume_service.py:process_resume_background", "process_resume_background_start", 
              {"session_id": session_id, "chunk_count": len(session_store[session_id]["chunks"])}, "A")
    # #endregion
    try:
        chunks = session_store[session_id]["chunks"]
        embedder = get_embedder()
        
        start_encode = time.time()
        # #region agent log
        debug_log("resume_service.py:process_resume_background", "embedding_encode_start", 
                  {"chunk_count": len(chunks)}, "A")
        # #endregion
        embeddings = embedder.encode(chunks, show_progress_bar=False, convert_to_numpy=True)
        encode_time = time.time() - start_encode
        # #region agent log
        debug_log("resume_service.py:process_resume_background", "embedding_encode_complete", 
                  {"time_seconds": encode_time, "embedding_shape": list(embeddings.shape)}, "A")
        # #endregion

        start_faiss = time.time()
        # #region agent log
        debug_log("resume_service.py:process_resume_background", "faiss_index_creation_start", 
                  {"embedding_dim": embeddings.shape[1]}, "C")
        # #endregion
        index = faiss.IndexFlatL2(embeddings.shape[1])
        index.add(embeddings.astype('float32'))
        faiss_time = time.time() - start_faiss
        # #region agent log
        debug_log("resume_service.py:process_resume_background", "faiss_index_creation_complete", 
                  {"time_seconds": faiss_time}, "C")
        # #endregion

        session_store[session_id]["faiss_index"] = index
        session_store[session_id]["embeddings"] = embeddings

        rag_status[session_id]["status"] = "ready"
        # #region agent log
        debug_log("resume_service.py:process_resume_background", "process_resume_background_complete", 
                  {"total_time": time.time() - start_encode}, "A")
        # #endregion

    except Exception as e:
        # #region agent log
        debug_log("resume_service.py:process_resume_background", "process_resume_background_error", 
                  {"error": str(e)}, "A")
        # #endregion
        rag_status[session_id] = {
            "status": "failed",
            "error": str(e)
        }

def upload_resume(file_bytes: bytes, filename: str) -> dict:
    """
    Upload and process resume - returns session_id immediately
    Processing happens in background thread
    """
    # #region agent log
    debug_log("resume_service.py:upload_resume", "upload_resume_start", {"filename": filename}, "E")
    # #endregion
    start_read = time.time()
    
    start_extract = time.time()
    # #region agent log
    debug_log("resume_service.py:upload_resume", "pdf_extraction_start", {}, "E")
    # #endregion
    text = extract_text_from_pdf(file_bytes)
    extract_time = time.time() - start_extract
    # #region agent log
    debug_log("resume_service.py:upload_resume", "pdf_extraction_complete", 
              {"time_seconds": extract_time, "text_length": len(text)}, "E")
    # #endregion
    
    start_chunk = time.time()
    # #region agent log
    debug_log("resume_service.py:upload_resume", "text_chunking_start", {"text_length": len(text)}, "E")
    # #endregion
    chunks = chunk_text(text)
    chunk_time = time.time() - start_chunk
    # #region agent log
    debug_log("resume_service.py:upload_resume", "text_chunking_complete", 
              {"time_seconds": chunk_time, "chunk_count": len(chunks)}, "E")
    # #endregion

    session_id = str(uuid.uuid4())

    session_store[session_id] = {
        "chunks": chunks,
        "filename": filename
    }

    rag_status[session_id] = {"status": "processing"}

    # #region agent log
    debug_log("resume_service.py:upload_resume", "background_thread_start", {"session_id": session_id}, "A")
    # #endregion
    # Start background processing in a separate thread
    thread = threading.Thread(
        target=process_resume_background,
        args=(session_id,),
        daemon=True
    )
    thread.start()

    # #region agent log
    debug_log("resume_service.py:upload_resume", "upload_resume_complete", 
              {"session_id": session_id, "total_time": time.time() - start_read}, "E")
    # #endregion
    return {
        "session_id": session_id,
        "status": "processing"
    }

def get_resume_status(session_id: str) -> dict:
    """Get the processing status of a resume"""
    if session_id not in rag_status:
        raise ValueError("Session not found")
    return rag_status[session_id]

def is_resume_ready(session_id: str) -> bool:
    """Check if resume processing is complete"""
    return rag_status.get(session_id, {}).get("status") == "ready"

def get_faiss_index(session_id: str):
    """Get FAISS index for a session"""
    if session_id not in session_store:
        raise ValueError("Session not found")
    return session_store[session_id].get("faiss_index")

def get_chunks(session_id: str) -> List[str]:
    """Get text chunks for a session"""
    if session_id not in session_store:
        raise ValueError("Session not found")
    return session_store[session_id]["chunks"]

