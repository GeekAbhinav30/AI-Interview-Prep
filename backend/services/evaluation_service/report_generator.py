"""
Final Interview Report Generator - Hybrid Engine (LLM Judge + Python Accountant)
"""

from backend.services.llm import call_llm
from backend.services.monitoring_service import monitoring_sessions
import json
import os


def calculate_aptitude_score(mcq_results: dict) -> float:
    """Calculate aptitude score using deterministic math"""
    if not mcq_results:
        return 0.0
    return round(mcq_results.get('accuracy', 0), 2)


def calculate_technical_score(tech_results: dict) -> float:
    """Calculate technical score using deterministic math"""
    if not tech_results:
        return 0.0
    return round(tech_results.get('accuracy', 0), 2)


def calculate_dsa_score(dsa_results: dict) -> float:
    """Calculate DSA score based on verdict"""
    if not dsa_results:
        return 0.0
    
    verdict = dsa_results.get("verdict", "fail").lower()
    if verdict == "pass":
        return 85.0
    elif verdict == "partial":
        return 60.0
    else:
        return 25.0


def calculate_resume_score(resume_results: dict) -> float:
    """Calculate resume score as average of relevance, clarity, completeness"""
    if not resume_results or not resume_results.get("responses"):
        return 0.0
    
    responses = resume_results.get("responses", [])
    if not responses:
        return 0.0
    
    total_relevance = sum(r.get("relevance", 0) for r in responses)
    total_clarity = sum(r.get("clarity", 0) for r in responses)
    total_completeness = sum(r.get("completeness", 0) for r in responses)
    
    # Average across all metrics (scale 1-3, convert to percentage)
    max_possible_points = len(responses) * 9  # 3 metrics * 3 points each
    actual_points = total_relevance + total_clarity + total_completeness
    
    if max_possible_points == 0:
        return 0.0
    
    avg_score = (actual_points / max_possible_points) * 100
    return round(min(avg_score, 100.0), 2)


def calculate_overall_score(aptitude: float, technical: float, dsa: float, resume: float) -> float:
    """Calculate weighted overall score"""
    weights = {
        "aptitude": 0.2,
        "technical": 0.2, 
        "dsa": 0.3,
        "resume": 0.3
    }
    
    weighted_score = (
        aptitude * weights["aptitude"] +
        technical * weights["technical"] +
        dsa * weights["dsa"] +
        resume * weights["resume"]
    )
    
    return round(weighted_score, 2)


def get_proctoring_analysis(session_id: str) -> dict:
    """Get proctoring analysis from monitoring session"""
    if session_id not in monitoring_sessions:
        return {"alert_count": 0, "summary": "No proctoring data available"}
    
    session = monitoring_sessions[session_id]
    alert_count = len(session.alerts)
    
    return {
        "alert_count": alert_count,
        "summary": f"Proctoring recorded {alert_count} alerts during interview"
    }


def recover_resume_data_from_cache() -> dict:
    """Recover resume evaluation data from cache"""
    try:
        # Load current cache
        if os.path.exists("llm_cache.json"):
            with open("llm_cache.json", 'r', encoding='utf-8') as f:
                cache_data = json.load(f)
        
        # Search for cache entries that contain resume evaluation data
        resume_data = {"responses": []}
        for cache_key, cache_value in cache_data.items():
            if "responses" in cache_value and "question_index" in cache_value:
                # Found resume evaluation in cache
                cached_eval = json.loads(cache_value)
                if isinstance(cached_eval, dict) and "responses" in cached_eval:
                    resume_data["responses"] = cached_eval["responses"]
                    print(f"🔄 Recovered {len(cached_eval['responses'])} resume evaluations from cache")
                    break
        
        return resume_data
        
    except Exception as e:
        print(f"⚠️ Cache recovery error: {e}")
        return {"responses": []}


def enhance_resume_data(resume_results: dict) -> dict:
    """Enhance resume data with question text and answers from cache"""
    if not resume_results or not resume_results.get("responses"):
        return {"responses": []}
    
    enhanced_responses = []
    questions = []
    user_answers = []
    
    # Try to recover original questions from cache
    try:
        if os.path.exists("llm_cache.json"):
            with open("llm_cache.json", 'r', encoding='utf-8') as f:
                cache_data = json.load(f)
            
            # Look for question generation cache entry
            for cache_key, cache_value in cache_data.items():
                if "questions" in cache_value and isinstance(cache_value, list):
                    questions = cache_value
                    print(f"🔍 Found {len(questions)} original questions in cache")
                    break
            
            # Look for user answers/transcripts in cache
            for cache_key, cache_value in cache_data.items():
                if isinstance(cache_value, dict) and "responses" in cache_value:
                    cached_responses = cache_value["responses"]
                    if cached_responses and "answer" in cached_responses[0]:
                        user_answers = [resp.get("answer", "") for resp in cached_responses]
                        print(f"🔍 Found {len(user_answers)} user answers in cache")
                        break
            
            # Build safe response objects
            for i, response in enumerate(resume_results.get("responses", [])):
                q_index = response.get("question_index", i)
                
                enhanced_responses.append({
                    "question_index": q_index,
                    
                    # ✅ ensure question always present
                    "question": response.get("question") 
                                or (questions[q_index] if q_index < len(questions) else "Question not available"),
                    
                    # ✅ ensure answer always present
                    "answer": response.get("answer") 
                              or (user_answers[q_index] if q_index < len(user_answers) else ""),
                    
                    # ✅ evaluation fields
                    "relevance": response.get("relevance", 0),
                    "clarity": response.get("clarity", 0),
                    "completeness": response.get("completeness", 0),
                    "feedback": response.get("feedback", "")
                })
    except Exception as e:
        print(f"⚠️ Resume enhancement error: {e}")
        enhanced_responses = resume_results.get("responses", [])
    
    return {"responses": enhanced_responses}


def generate_final_report(
    mcq_results: dict,
    dsa_results: dict,
    resume_results: dict,
    session_id: str = None
) -> dict:

    # Safety defaults
    mcq_results = mcq_results or {}
    dsa_results = dsa_results or {}
    resume_results = resume_results or {"responses": []}

    # Recover missing resume data from cache if needed
    if not resume_results.get("responses"):
        resume_results = recover_resume_data_from_cache()
        if resume_results.get("responses"):
            print(f"🔄 Recovered resume data from cache")

    # STEP A: THE ACCOUNTANT (Python Logic) - Deterministic Calculations
    aptitude_score = calculate_aptitude_score(mcq_results)
    technical_score = calculate_technical_score(mcq_results)  # Using same MCQ results for technical
    dsa_score = calculate_dsa_score(dsa_results)
    resume_score = calculate_resume_score(resume_results)
    overall_score = calculate_overall_score(aptitude_score, technical_score, dsa_score, resume_score)

    # Get proctoring analysis if session_id provided
    proctoring_analysis = get_proctoring_analysis(session_id) if session_id else {"alert_count": 0, "summary": "No proctoring data"}

    print(f"✅ Deterministic scores calculated: A={aptitude_score}, T={technical_score}, D={dsa_score}, R={resume_score}, O={overall_score}")

    # STEP B: THE JUDGE (LLM Evaluation) - Qualitative feedback only
    strengths = []
    weaknesses = []
    final_verdict = "Borderline"

    try:
        # Prepare resume Q&A data for LLM analysis
        resume_qa_summary = ""
        if resume_results.get("responses"):
            resume_qa_summary = "\n".join([
                f"Q{i}: {r.get('question', 'N/A')}\nA: {r.get('answer', 'N/A')}\nScore: R={r.get('relevance', 0)}/C={r.get('clarity', 0)}/Co={r.get('completeness', 0)}"
                for i, r in enumerate(resume_results["responses"][:5])  # Limit to first 5 for prompt length
            ])

        judge_prompt = f"""
🦁 MASTER LION KING: LLM Holistic Scoring with Dynamic Score Injection

You are the Senior Technical Interviewer. Based on the candidate's actual performance data, generate an overall_score out of 100.

CANDIDATE PERFORMANCE DATA:
- Aptitude accuracy: {aptitude_score}%
- Technical accuracy: {technical_score}%
- DSA code score: {dsa_score}%
- Resume evaluation average: {resume_score}%

🦁 MASTER LION KING CRITICAL INSTRUCTIONS:
1. Generate an overall_score out of 100 (e.g., 82.5, 91.0) based STRICTLY on the data provided
2. DO NOT hardcode perfect scores
3. DO NOT hallucinate a score out of 10
4. Base the final percentage on weighted average: Aptitude(25%) + Technical(25%) + DSA(30%) + Resume(20%)

Return ONLY valid JSON with:
{{
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "final_verdict": "Hire" or "Borderline" or "Reject",
  "overall_score": number
}}
"""
        
        raw = call_llm(judge_prompt)
        judge_data = json.loads(raw)
        
        strengths = judge_data.get("strengths", [])
        weaknesses = judge_data.get("weaknesses", [])
        final_verdict = judge_data.get("final_verdict", "Borderline")

        print(f"✅ LLM Judge provided qualitative feedback")

    except Exception as e:
        print(f"❌ LLM Judge error: {e}")
        # Fallback deterministic verdict
        if overall_score >= 70:
            final_verdict = "Hire"
        elif overall_score >= 50:
            final_verdict = "Borderline"
        else:
            final_verdict = "Reject"
        
        strengths = [f"Strong overall performance ({overall_score}%)"]
        weaknesses = ["Areas for improvement identified"]

    # STEP C: THE UNIFIED SCHEMA - Frontend-compatible structure
    report = {
        "scores": {
            "aptitude": aptitude_score,
            "technical": technical_score,
            "dsa": dsa_score,
            "resume": resume_score,
            "overall": overall_score
        },
        "mcq_stats": {
            "aptitude": mcq_results if mcq_results else {"score": 0, "total": 0, "accuracy": 0},
            "technical": mcq_results if mcq_results else {"score": 0, "total": 0, "accuracy": 0}
        },
        "resume_results": enhance_resume_data(resume_results),  # Enhanced Q&A data
        "proctoring_analysis": proctoring_analysis,
        "final_verdict": final_verdict,
        "strengths": strengths,
        "weaknesses": weaknesses
    }

    return report
