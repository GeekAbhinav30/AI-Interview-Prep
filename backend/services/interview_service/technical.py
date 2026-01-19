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


def _fallback_technical_questions():
    """
    Quota-safe fallback technical MCQs
    Used when Gemini quota is exceeded
    """
    return {
        "questions": [
            {
                "question": "What is the time complexity of binary search?",
                "options": ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
                "correct_index": 1
            },
            {
                "question": "Which data structure follows FIFO?",
                "options": ["Stack", "Queue", "Tree", "Graph"],
                "correct_index": 1
            },
            {
                "question": "Which HTTP method is idempotent?",
                "options": ["POST", "PATCH", "GET", "CONNECT"],
                "correct_index": 2
            },
            {
                "question": "What is a closure in programming?",
                "options": [
                    "A loop construct",
                    "A function with preserved lexical scope",
                    "A class property",
                    "A memory leak"
                ],
                "correct_index": 1
            },
            {
                "question": "Which data structure is used in BFS?",
                "options": ["Stack", "Queue", "Heap", "Set"],
                "correct_index": 1
            }
        ]
    }


def generate_technical_questions(session_id: str, difficulty: str = "medium"):
    """
    Generate technical MCQs using Gemini LLM.
    Falls back gracefully if quota is exceeded.
    """

    prompt = TECHNICAL_PROMPT.format(difficulty=difficulty)

    try:
        response = call_llm(prompt)

        # 🔍 Debug log (safe to remove later)
        print("\n===== RAW GEMINI RESPONSE (TECHNICAL) =====\n")
        print(response)
        print("\n==========================================\n")

        data = _safe_json_parse(response)

        if "questions" not in data or not isinstance(data["questions"], list):
            raise ValueError("Invalid technical question format")

        return data

    except Exception as e:
        # 🔥 Critical quota-safe fallback
        print(f"⚠️ Technical question generation failed: {e}")
        print("⚠️ Returning fallback technical questions")

        return _fallback_technical_questions()
