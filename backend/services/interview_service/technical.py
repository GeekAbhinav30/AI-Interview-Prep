# services/interview_service/technical.py

from backend.services.llm import call_llm
from .prompts import TECHNICAL_PROMPT

import json
import re


def _safe_json_parse(text: str):
    """
    Safely parse JSON returned by LLM.
    Handles cases where LLM adds extra text before/after JSON.
    """
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{[\s\S]*\}", text)
        if not match:
            raise ValueError("No JSON object found in LLM response")

        return json.loads(match.group())


def generate_technical_questions(session_id: str, difficulty: str = "medium"):
    """
    Generate technical MCQs using Gemini LLM.
    """

    prompt = TECHNICAL_PROMPT.format(difficulty=difficulty)
    response = call_llm(prompt)

    # 🔍 TEMP DEBUG (remove after verification)
    print("\n===== RAW GEMINI RESPONSE (TECHNICAL) =====\n")
    print(response)
    print("\n==========================================\n")

    try:
        data = _safe_json_parse(response)

        if "questions" not in data or not isinstance(data["questions"], list):
            raise ValueError("Invalid technical question format")

        return data

    except Exception as e:
        return {
            "error": "Failed to generate technical questions",
            "details": str(e)
        }
