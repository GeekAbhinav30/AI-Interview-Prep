"""
Final Interview Report Generator
"""

from backend.services.llm import call_llm
import json


def generate_final_report(
    mcq_results: dict,
    dsa_results: dict,
    resume_results: dict
) -> dict:

    # Safety defaults
    mcq_results = mcq_results or {"score": 0, "accuracy": 0}
    dsa_results = dsa_results or {"verdict": "fail"}
    resume_results = resume_results or {"responses": []}

    prompt = f"""
You are a senior technical interviewer.

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- Parsable by json.loads()

SCHEMA:
{{
  "strengths": [string],
  "weaknesses": [string],
  "overall_score": number,
  "final_verdict": "Hire" | "Borderline" | "Reject"
}}

INPUT:
MCQ_RESULTS = {mcq_results}
DSA_RESULTS = {dsa_results}
RESUME_RESULTS = {resume_results}
"""

    try:
        raw = call_llm(prompt)
        return json.loads(raw)

    except Exception as e:
        print(f"Final Report Error: {e}")
        return {
            "strengths": [],
            "weaknesses": ["Evaluation incomplete due to system limits"],
            "overall_score": 0,
            "final_verdict": "Reject"
        }
