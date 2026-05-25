"""
Audio Transcription Service
Real Whisper-based implementation for speech-to-text
"""

import base64
import re
import os
import whisper

# Load Whisper model once globally (for performance)
try:
    whisper_model = whisper.load_model("base")
    print("✅ Whisper model loaded successfully")
except Exception as e:
    print(f"❌ Failed to load Whisper model: {e}")
    whisper_model = None


def transcribe_audio(audio_base64: str) -> str:
    """
    Transcribe audio from base64 encoded string using Whisper.
    Handles Data URLs safely and provides real speech-to-text.
    """
    
    # Check if Whisper model is available
    if not whisper_model:
        return "Transcription service unavailable"
    
    try:
        # Extract base64 data from DataURL
        if audio_base64.startswith("data:"):
            audio_base64 = re.sub(r"^data:audio\/.*;base64,", "", audio_base64)

        # Fix padding for valid base64
        missing_padding = len(audio_base64) % 4
        if missing_padding:
            audio_base64 += "=" * (4 - missing_padding)

        # Validate base64 and decode
        try:
            audio_data = base64.b64decode(audio_base64, validate=True)
        except Exception as e:
            print(f"Base64 validation failed: {e}")
            return "Transcription failed"

        # Check if audio data is empty
        if len(audio_data) == 0:
            return "No response provided"

        # Create temporary file for audio (simplified approach)
        temp_path = "temp_audio.webm"
        
        try:
            with open(temp_path, "wb") as f:
                f.write(audio_data)
            
            # Transcribe using Whisper
            result = whisper_model.transcribe(temp_path)
            transcribed_text = result["text"].strip()
            
            # Debug logging
            print("Transcribed Text:", transcribed_text)
            
            # Return transcribed text or fallback
            if transcribed_text:
                return transcribed_text
            else:
                return "No speech detected"
                
        except Exception as e:
            print("Whisper Error:", e)
            return "Candidate provided an answer but audio could not be transcribed clearly."
            
        finally:
            # Always cleanup temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)

    except Exception as e:
        print(f"Audio Transcription Error: {e}")
        return "Transcription failed"
