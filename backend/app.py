"""
Main FastAPI application - Modular structure
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Config
from backend.config import (
    GEMINI_API_KEY,
    LOG_FILENAME,
    MODELS_DIR,
    UPLOAD_FOLDER,
)

# Services
from backend.services.detection_service import (
    get_yolo_info,
    is_yolo_available,
)
from backend.services.monitoring_service import monitoring_sessions
from backend.services.resume_service import session_store

# Routes
from backend.routes import resume_routes, monitoring_routes

# Utils
from backend.utils.logger import log_event


# Create FastAPI app
app = FastAPI(title="AI Interview Assistant API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(resume_routes.router)
app.include_router(monitoring_routes.router)


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "active_sessions": len(monitoring_sessions),
        "yolo_available": is_yolo_available(),
        "mediapipe_available": True,
        "gemini_configured": GEMINI_API_KEY is not None,
    }


@app.get("/system_info")
async def system_info():
    """Get system information"""
    yolo_info = get_yolo_info()
    return {
        "yolo_model_loaded": yolo_info["available"],
        "yolo_type": yolo_info["type"],
        "mediapipe_available": True,
        "face_mesh_enabled": True,
        "hand_detection_enabled": True,
        "gemini_configured": GEMINI_API_KEY is not None,
        "active_monitoring_sessions": len(monitoring_sessions),
        "active_rag_sessions": len(session_store),
        "log_file": LOG_FILENAME,
        "models_directory": MODELS_DIR,
        "upload_directory": UPLOAD_FOLDER,
    }


@app.on_event("startup")
async def startup_event():
    """Startup event handler"""
    print("=" * 80)
    print("AI Interview Assistant - Modular Backend Server")
    print("=" * 80)
    print("✓ FastAPI initialized")

    yolo_info = get_yolo_info()
    print(
        f"✓ YOLO Model: {'Loaded (' + yolo_info['type'] + ')' if yolo_info['available'] else 'Not available'}"
    )

    print("✓ MediaPipe Face Mesh: Enabled")
    print("✓ MediaPipe Hands: Enabled")
    print("✓ Sentence Transformer: Lazy loaded")
    print(f"✓ Gemini API: {'Configured' if GEMINI_API_KEY else 'Not configured'}")
    print(f"✓ Log file: {LOG_FILENAME}")
    print(f"✓ Upload folder: {UPLOAD_FOLDER}")
    print(f"✓ Models folder: {MODELS_DIR}")

    print("=" * 80)
    print("\nAvailable endpoints:")
    print("  POST   /upload_resume        - Upload resume for RAG")
    print("  GET    /resume_status/{id}   - Get resume processing status")
    print("  POST   /generate_questions   - Generate interview questions")
    print("  POST   /start_monitoring     - Start attention monitoring")
    print("  POST   /stop_monitoring      - Stop attention monitoring")
    print("  POST   /process_frame        - Process video frame")
    print("  POST   /room_scan            - Check for extra persons")
    print("  POST   /complete_room_scan   - Mark room scan complete")
    print("  GET    /get_alerts           - Get session alerts")
    print("  GET    /session_summary      - Get session summary")
    print("  GET    /download_log         - Download CSV log")
    print("  GET    /health               - Health check")
    print("  GET    /system_info          - System information")
    print("  POST   /test_camera          - Test camera connection")
    print("  POST   /clear_session        - Clear monitoring session")
    print("=" * 80)

    log_event("SERVER_STARTED", "Modular backend server initialized")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
