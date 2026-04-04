"""
DSA Code Evaluation Service
Uses LLM to evaluate code solutions
"""

import json
import re
from backend.schemas import DSAProblem, DSAEvaluationResponse
from backend.services.llm import call_llm


def _safe_json_parse(text: str) -> dict:
    """Safely parse JSON from LLM response"""
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Extract JSON block from response
        match = re.search(r'\{[\s\S]*\}', text)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass
        raise ValueError("Invalid JSON response from LLM")


def evaluate_dsa_solution(
    problem: DSAProblem, 
    user_code: str
) -> DSAEvaluationResponse:
    """
    Evaluate DSA code solution using LLM
    """
    
    prompt = f"""
 MASTER LION KING: You are an Expert Algorithm Reviewer. Evaluate the provided code. Return ONLY valid JSON containing:

1. `dsa_score` (out of 100)
2. `time_complexity` (Big-O notation)  
3. `space_complexity` (Big-O notation)
4. `feedback` (qualitative critique)

PROBLEM:
Title: {problem.title}
Description: {problem.problem}
Constraints: {problem.constraints}
Example: {problem.example}

USER CODE:
{user_code}

IMPORTANT: Return ONLY valid JSON. Do not include markdown formatting or explanations.
"""

    try:
        response = call_llm(prompt)
        data = _safe_json_parse(response)
        
        # Validate required fields
        required_fields = ["dsa_score", "time_complexity", "space_complexity", "feedback"]
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Missing required field: {field}")
        
        return DSAEvaluationResponse(
            correctness=str(data.get("feedback", "evaluation_complete")),
            approach=str(data.get("feedback", "evaluation_complete")),
            time_complexity=str(data["time_complexity"]),
            space_complexity=str(data["space_complexity"]),
            verdict="pass" if data["dsa_score"] >= 70 else "partial" if data["dsa_score"] >= 40 else "fail",
            dsa_score=float(data["dsa_score"])
        )
        
    except Exception as e:
        print(f"DSA Evaluation Error: {str(e)}")
        return DSAEvaluationResponse(
            correctness="evaluation_error",
            approach="evaluation_error",
            time_complexity="unknown",
            space_complexity="unknown",
            verdict="evaluation_error",
            dsa_score=0.0,
            error="LLM failed safely"
        )