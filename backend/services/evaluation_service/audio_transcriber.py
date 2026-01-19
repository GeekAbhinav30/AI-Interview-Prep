"""
Audio Transcription Service
Safe mock implementation (DataURL + base64 compatible)
"""

import base64
import re


def transcribe_audio(audio_base64: str) -> str:
    """
    Transcribe audio from base64 encoded string.
    Handles Data URLs safely.
    """

    try:
        # ✅ Remove data URL prefix if present
        if audio_base64.startswith("data:"):
            audio_base64 = re.sub(r"^data:audio\/.*;base64,", "", audio_base64)

        # ✅ Fix padding
        missing_padding = len(audio_base64) % 4
        if missing_padding:
            audio_base64 += "=" * (4 - missing_padding)

        # Validate base64 (will throw if invalid)
        base64.b64decode(audio_base64, validate=True)

        # 🔧 MOCK transcription (no external API)
        return "Mock transcript: Candidate explained their experience clearly."

    except Exception as e:
        print(f"Audio Transcription Error: {e}")
        return "Transcription unavailable"
