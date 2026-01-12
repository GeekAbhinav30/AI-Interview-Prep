# services/interview_service/aptitude.py

from backend.services.llm import call_llm
from .prompts import APTITUDE_PROMPT

import json
import re


def _safe_json_parse(text: str):
    """
    Safely parse JSON returned by LLM.
    Handles cases where LLM adds extra text before/after JSON.
    """
    try:
        # First try direct parse
        return json.loads(text)
    except json.JSONDecodeError:
        # Fallback: extract JSON block
        match = re.search(r"\{[\s\S]*\}", text)
        if not match:
            raise ValueError("No JSON object found in LLM response")

        return json.loads(match.group())


def generate_aptitude_questions(session_id: str, difficulty: str = "medium"):
    """
    Generate aptitude MCQs using Gemini LLM.
    """

    prompt = APTITUDE_PROMPT.format(difficulty=difficulty)

    response = call_llm(prompt)

    # 🔍 TEMP DEBUG (you can remove later)
    print("\n===== RAW GEMINI RESPONSE (APTITUDE) =====\n")
    print(response)
    print("\n=========================================\n")

    try:
        data = _safe_json_parse(response)

        # Basic validation (defensive)
        if "questions" not in data or not isinstance(data["questions"], list):
            raise ValueError("Invalid question format")

        return data

    except Exception as e:
        return {
            "error": "Failed to generate aptitude questions",
            "details": str(e)
        }
