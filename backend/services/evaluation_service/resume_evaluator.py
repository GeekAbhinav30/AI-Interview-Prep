"""
Resume Answer Evaluation Service
ONE LLM call (rate-limit safe)
"""

from typing import List, Dict
from backend.services.evaluation_service.audio_transcriber import transcribe_audio
from backend.services.llm import call_llm
import json


def evaluate_resume_answers(
    questions: List[str],
    audio_recordings: Dict[int, str]
) -> Dict:
    """
    Transcribe audio answers and evaluate them in ONE LLM call
    """

    transcripts = {}

    # Step 1: Transcribe all audio (mock)
    for idx, audio_base64 in audio_recordings.items():
        transcripts[int(idx)] = transcribe_audio(audio_base64)

    # Step 2: Prepare combined payload
    qa_pairs = []
    for i, question in enumerate(questions):
        qa_pairs.append({
            "question_index": i,
            "question": question,
            "answer": transcripts.get(i, "No response provided")
        })

    prompt = f"""
You are an interview evaluator.

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations
- Must be parsable by json.loads()

SCHEMA:
{{
  "responses": [
    {{
      "question_index": number,
      "relevance": number,
      "clarity": number,
      "completeness": number,
      "feedback": string
    }}
  ]
}}

DATA:
{json.dumps(qa_pairs, indent=2)}
"""

    try:
        raw = call_llm(prompt)
        return json.loads(raw)

    except Exception as e:
        print(f"Resume Evaluation Error: {e}")
        return {
            "responses": [],
            "error": "Resume evaluation failed due to LLM limits"
        }
