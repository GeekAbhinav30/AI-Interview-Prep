from fastapi import APIRouter
from backend.schemas import (
    MCQEvaluationRequest,
    DSAEvaluationRequest,
    ResumeAudioRequest,
    FinalReportRequest
)

from backend.services.evaluation_service.mcq_evaluator import evaluate_mcq_answers
from backend.services.evaluation_service.dsa_evaluator import evaluate_dsa_solution
from backend.services.evaluation_service.resume_evaluator import evaluate_resume_answers
from backend.services.evaluation_service.report_generator import generate_final_report

router = APIRouter(prefix="/evaluation", tags=["evaluation"])


@router.post("/mcq")
def mcq_evaluation(payload: MCQEvaluationRequest):
    return evaluate_mcq_answers(
        payload.questions,
        payload.user_answers
    )


@router.post("/dsa")
def dsa_evaluation(payload: DSAEvaluationRequest):
    return evaluate_dsa_solution(
        payload.problem,
        payload.user_code
    )


@router.post("/resume")
def resume_evaluation(payload: ResumeAudioRequest):
    return evaluate_resume_answers(
        payload.questions,
        payload.audio_recordings
    )


@router.post("/report")
def final_report(payload: FinalReportRequest):
    return generate_final_report(
        payload.mcq_results,
        payload.dsa_results,
        payload.resume_results
    )
