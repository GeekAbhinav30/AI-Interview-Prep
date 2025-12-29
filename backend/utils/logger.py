"""
Logging utilities
"""
import csv
import os
import json
import time
from datetime import datetime
from backend.config import LOG_FILENAME

# Initialize CSV log
if not os.path.exists(LOG_FILENAME):
    with open(LOG_FILENAME, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp_utc", "event", "detail"])

def log_event(event: str, detail: str = ""):
    """Log event to CSV file"""
    ts = datetime.utcnow().isoformat()
    print(f"[{ts}] {event} - {detail}")
    with open(LOG_FILENAME, "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([ts, event, detail])

# Debug logging setup
DEBUG_LOG_PATH = r"c:\Harsh\Desktop\automateinterview\.cursor\debug.log"

def debug_log(location, message, data=None, hypothesis_id=None):
    """Write debug log in NDJSON format"""
    try:
        log_entry = {
            "id": f"log_{int(time.time() * 1000)}",
            "timestamp": int(time.time() * 1000),
            "location": location,
            "message": message,
            "data": data or {},
            "sessionId": "debug-session",
            "runId": "run1",
            "hypothesisId": hypothesis_id or "A"
        }
        with open(DEBUG_LOG_PATH, "a", encoding="utf-8") as f:
            f.write(json.dumps(log_entry) + "\n")
    except Exception as e:
        print(f"Debug log error: {e}")

