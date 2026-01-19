"""
MCQ Evaluation Service
Deterministic evaluation without LLM
"""

from typing import Dict, List
from backend.schemas import MCQQuestion, MCQEvaluationResponse


def evaluate_mcq_answers(
    questions: List[MCQQuestion], 
    user_answers: Dict[int, int]
) -> MCQEvaluationResponse:
    """
    Evaluate MCQ answers by comparing against correct indices.
    """
    
    total_questions = len(questions)
    correct_count = 0
    wrong_questions = []
    
    for idx, question in enumerate(questions):
        user_answer = user_answers.get(idx)
        correct_answer = question.correct_index
        
        if user_answer == correct_answer:
            correct_count += 1
        else:
            wrong_questions.append({
                "question_index": idx,
                "user_answer": user_answer if user_answer is not None else -1,
                "correct_answer": correct_answer
            })
    
    accuracy = (correct_count / total_questions * 100) if total_questions > 0 else 0.0
    
    return MCQEvaluationResponse(
        score=correct_count,
        total=total_questions,
        accuracy=round(accuracy, 2),
        wrong_questions=wrong_questions
    )