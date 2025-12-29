"""
Configuration constants and settings
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ------------------------------------------------------------------
# Base paths
# ------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent

# ------------------------------------------------------------------
# API Keys
# ------------------------------------------------------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# ------------------------------------------------------------------
# Directories (ALL backend-controlled)
# ------------------------------------------------------------------
UPLOAD_FOLDER = BASE_DIR / "uploads"
MODELS_DIR = BASE_DIR / "models"

# YOLO model paths (LOCAL ONLY)
YOLO_DIR = MODELS_DIR / "yolo"
YOLO_MODEL_PATH = YOLO_DIR / "yolov5s.pt"

# Logs
LOG_FILENAME = BASE_DIR / "attention_log.csv"

# ------------------------------------------------------------------
# Create directories if they don't exist
# ------------------------------------------------------------------
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(YOLO_DIR, exist_ok=True)

# ------------------------------------------------------------------
# Monitoring thresholds
# ------------------------------------------------------------------
LOOK_AWAY_SECONDS_THRESHOLD = 2.0
NO_FACE_SECONDS_THRESHOLD = 1.5
PARTIAL_FACE_SECONDS_THRESHOLD = 1.5
MIN_FACE_BOX_WIDTH = 0.22
EDGE_MARGIN = 0.03

GAZE_LEFT_THRESH = 0.35
GAZE_RIGHT_THRESH = 0.65
EYE_DOWN_THRESH = 0.70
EYE_UP_THRESH = 0.30
HEAD_PITCH_DOWN_DEG = 30.0

HAND_WRITING_Y_THRESHOLD = 0.65
HAND_MOTION_WINDOW = 1.5
HAND_MOTION_MIN_SPEED = 0.006

# ------------------------------------------------------------------
# Face mesh landmark indices
# ------------------------------------------------------------------
LEFT_EYE_CORNERS = [33, 133]
RIGHT_EYE_CORNERS = [362, 263]
LEFT_IRIS = [468, 469, 470, 471]
RIGHT_IRIS = [473, 474, 475, 476]
LEFT_EYE_TOP = 159
LEFT_EYE_BOTTOM = 145
RIGHT_EYE_TOP = 386
RIGHT_EYE_BOTTOM = 374

HP_N = 1
HP_CHIN = 152
HP_LEFT_EYE = 33
HP_RIGHT_EYE = 263
HP_LEFT_MOUTH = 61
HP_RIGHT_MOUTH = 291

# ------------------------------------------------------------------
# Head pose model points
# ------------------------------------------------------------------
MODEL_POINTS = [
    (0.0, 0.0, 0.0),
    (0.0, -63.6, -12.5),
    (-43.3, 32.7, -26.0),
    (43.3, 32.7, -26.0),
    (-28.9, -28.9, -20.0),
    (28.9, -28.9, -20.0),
]
