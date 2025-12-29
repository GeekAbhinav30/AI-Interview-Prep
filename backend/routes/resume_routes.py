"""
Resume-related API routes
"""

import time
import base64
import numpy as np
import cv2

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from sentence_transformers import SentenceTransformer

# ✅ FIXED: services imports
from backend.services.resume_service import (
    upload_resume as process_resume_upload,
    get_resume_status,
    is_resume_ready,
    get_faiss_index,
    get_chunks,
)

from backend.services.gemini_service import generate_questions

# ✅ FIXED: utils import
from backend.utils.logger import debug_log, log_event


router = APIRouter(tags=["resume"])

# Lazy load embedder for keyword embedding
_embedder = None


def get_embedder():
    """Lazy load embedder"""
    global _embedder
    if _embedder is None:
        _embedder = SentenceTransformer("all-MiniLM-L6-v2")
    return _embedder


@router.post("/upload_resume")
async def upload_resume_endpoint(file: UploadFile = File(...)):
    """Upload resume PDF and start processing"""
    # #region agent log
    debug_log(
        "resume_routes.py:upload_resume",
        "upload_resume_start",
        {"filename": file.filename},
        "E",
    )
    # #endregion

    start_read = time.time()
    contents = await file.read()
    read_time = time.time() - start_read

    # #region agent log
    debug_log(
        "resume_routes.py:upload_resume",
        "file_read_complete",
        {"time_seconds": read_time, "file_size_bytes": len(contents)},
        "E",
    )
    # #endregion

    result = process_resume_upload(contents, file.filename)

    # #region agent log
    debug_log(
        "resume_routes.py:upload_resume",
        "upload_resume_complete",
        {
            "session_id": result["session_id"],
            "total_time": time.time() - start_read,
        },
        "E",
    )
    # #endregion

    return result


@router.get("/resume_status/{session_id}")
async def resume_status_endpoint(session_id: str):
    """Get resume processing status"""
    try:
        return get_resume_status(session_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Session not found")


@router.post("/generate_questions")
async def generate_questions_endpoint(
    session_id: str = Form(...),
    job_description: str = Form(...),
):
    """Generate interview questions using RAG + Gemini"""

    # #region agent log
    debug_log(
        "resume_routes.py:generate_questions",
        "generate_questions_start",
        {"session_id": session_id, "job_desc_length": len(job_description)},
        "B",
    )
    # #endregion

    # Check if session exists
    try:
        status = get_resume_status(session_id)
    except ValueError:
        debug_log(
            "resume_routes.py:generate_questions",
            "session_not_found",
            {"session_id": session_id},
            "B",
        )
        raise HTTPException(status_code=404, detail="Session not found")

    # Check if resume is ready
    resume_status_val = status.get("status")
    debug_log(
        "resume_routes.py:generate_questions",
        "resume_status_check",
        {"session_id": session_id, "status": resume_status_val},
        "B",
    )

    if resume_status_val != "ready":
        raise HTTPException(
            status_code=400,
            detail="Resume is still processing",
        )

    try:
        start_total = time.time()

        # Keyword extraction
        debug_log(
            "resume_routes.py:generate_questions",
            "keyword_extraction_start",
            {},
            "D",
        )

        keywords = [
            w.strip(".,") for w in job_description.split() if len(w) > 3
        ]

        debug_log(
            "resume_routes.py:generate_questions",
            "keyword_extraction_complete",
            {"keyword_count": len(keywords)},
            "D",
        )

        # Embed keywords
        debug_log(
            "resume_routes.py:generate_questions",
            "keyword_embedding_start",
            {},
            "D",
        )

        embedder = get_embedder()
        keyword_embeds = embedder.encode(
            [" ".join(keywords)], show_progress_bar=False
        )

        debug_log(
            "resume_routes.py:generate_questions",
            "keyword_embedding_complete",
            {},
            "D",
        )

        # RAG search
        debug_log(
            "resume_routes.py:generate_questions",
            "rag_search_start",
            {},
            "D",
        )

        index = get_faiss_index(session_id)
        D, I = index.search(keyword_embeds.astype("float32"), 3)

        debug_log(
            "resume_routes.py:generate_questions",
            "rag_search_complete",
            {},
            "D",
        )

        # Get relevant chunks
        chunks = get_chunks(session_id)
        relevant_chunks = [
            chunks[i] for i in I[0] if i < len(chunks)
        ]

        resume_context = "\n".join(relevant_chunks)

        # Gemini generation
        questions = generate_questions(
            resume_context, job_description
        )

        total_time = time.time() - start_total

        debug_log(
            "resume_routes.py:generate_questions",
            "generate_questions_complete",
            {
                "total_time": total_time,
                "question_count": len(questions),
            },
            "D",
        )

        log_event(
            "QUESTIONS_GENERATED",
            f"session={session_id}, count={len(questions)}",
        )

        return {
            "questions": questions,
            "session_id": session_id,
        }

    except Exception as e:
        debug_log(
            "resume_routes.py:generate_questions",
            "generate_questions_error",
            {"error": str(e)},
            "D",
        )
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate questions: {str(e)}",
        )
