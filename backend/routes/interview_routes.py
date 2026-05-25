from fastapi import APIRouter
from backend.services.interview_service import (
    generate_aptitude_questions,
    generate_technical_questions,
    generate_dsa_question
)


router = APIRouter(prefix="/interview", tags=["Interview"])

@router.post("/aptitude")
def aptitude(session_id: str):
    return generate_aptitude_questions(session_id)

@router.post("/technical")
def technical(session_id: str):
    return generate_technical_questions(session_id)

@router.post("/dsa")
def dsa(session_id: str):
    return generate_dsa_question(session_id)
