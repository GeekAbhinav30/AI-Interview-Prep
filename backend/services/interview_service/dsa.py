# services/interview_service/dsa.py

from backend.services.llm import call_llm
from .prompts import DSA_PROMPT

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


def generate_dsa_question(session_id: str, difficulty: str = "medium"):
    """
    Generate a DSA coding question using Gemini LLM.
    """

    prompt = DSA_PROMPT.format(difficulty=difficulty)
    response = call_llm(prompt)

    # 🔍 TEMP DEBUG (remove later)
    print("\n===== RAW GEMINI RESPONSE (DSA) =====\n")
    print(response)
    print("\n====================================\n")

    try:
        data = _safe_json_parse(response)

        # Basic validation
        required_keys = {"title", "problem", "constraints", "example"}
        if not required_keys.issubset(data.keys()):
            raise ValueError("Invalid DSA question format")

        return data

    except Exception as e:
        return {
            "error": "Failed to generate DSA question",
            "details": str(e)
        }
