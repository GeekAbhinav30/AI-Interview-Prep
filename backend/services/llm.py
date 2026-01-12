"""
Gemini AI service for question generation
"""
import google.generativeai as genai
from backend.config import GEMINI_API_KEY
from backend.utils.logger import debug_log
import time

# Configure Gemini API
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


def call_llm(prompt: str) -> str:
    """
    Generic Gemini LLM caller for non-resume interview rounds
    (aptitude, technical, dsa)
    """
    if not GEMINI_API_KEY:
        raise ValueError("Gemini API key not configured")

    model = genai.GenerativeModel("gemini-2.5-flash-lite")
    response = model.generate_content(prompt)

    return response.text


def generate_questions(resume_context: str, job_description: str) -> list:
    """
    Generate resume-based interview questions using Gemini AI
    (USED ONLY for resume interview)
    """
    start_gemini = time.time()

    debug_log(
        "gemini_service.py:generate_questions",
        "gemini_api_call_start",
        {"prompt_length": len(resume_context) + len(job_description)},
        "D",
    )

    if not GEMINI_API_KEY:
        raise ValueError("Gemini API key not configured")

    prompt = f"""
You are an interview coach. Based on the following resume and job description,
generate 10 tailored interview preparation questions:

Resume Context:
{resume_context}

Job Description:
{job_description}
"""

    model = genai.GenerativeModel("gemini-2.5-flash-lite")
    response = model.generate_content(prompt)

    questions = [
        q.strip()
        for q in response.text.split("\n")
        if q.strip()
    ]

    gemini_time = time.time() - start_gemini

    debug_log(
        "gemini_service.py:generate_questions",
        "gemini_api_call_complete",
        {"time_seconds": gemini_time, "question_count": len(questions)},
        "D",
    )

    return questions
