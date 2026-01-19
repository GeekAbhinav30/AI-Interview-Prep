"""
Pydantic models for request/response validation
"""

from pydantic import BaseModel
from typing import Optional, List, Dict, Literal, Any


# =========================
# Proctoring / Session
# =========================

class FrameRequest(BaseModel):
    session_id: str
    frame: str


class SessionRequest(BaseModel):
    session_id: str


class RoomScanComplete(BaseModel):
    session_id: str
    passed: bool


# =========================
# MCQ Evaluation
# =========================

class MCQQuestion(BaseModel):
    question: str
    options: List[str]
    correct_index: int


class MCQEvaluationRequest(BaseModel):
    session_id: str
    type: Literal["aptitude", "technical"]
    questions: List[MCQQuestion]
    user_answers: Dict[int, int]


class MCQEvaluationResponse(BaseModel):
    score: int
    total: int
    accuracy: float
    wrong_questions: List[Dict[str, int]]


# =========================
# DSA Evaluation  ✅ FIXED
# =========================

class DSAProblem(BaseModel):
    title: str
    problem: str
    constraints: Optional[str] = None
    example: Any  # ✅ ACCEPTS string | object | list (prevents 422)


class DSAEvaluationRequest(BaseModel):
    session_id: str
    problem: DSAProblem
    user_code: str


class DSAEvaluationResponse(BaseModel):
    correctness: str
    approach: str
    time_complexity: str
    space_complexity: str
    verdict: Literal["pass", "partial", "fail"]
    error: Optional[str] = None


# =========================
# Resume Audio Evaluation
# =========================

class ResumeAudioRequest(BaseModel):
    session_id: str
    questions: List[str]
    audio_recordings: Dict[int, str]  # base64 or DataURL


class ResumeAnswerEvaluation(BaseModel):
    question_index: int
    transcript: str
    relevance: int
    clarity: int
    completeness: int
    feedback: str
    error: Optional[str] = None


class ResumeEvaluationResponse(BaseModel):
    responses: List[ResumeAnswerEvaluation]


# =========================
# Final Report
# =========================

class FinalReportRequest(BaseModel):
    session_id: str
    mcq_results: Optional[MCQEvaluationResponse] = None
    dsa_results: Optional[DSAEvaluationResponse] = None
    resume_results: Optional[ResumeEvaluationResponse] = None


class FinalReportResponse(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    overall_score: int
    final_verdict: Literal["Hire", "Borderline", "Reject"]
    error: Optional[str] = None
