"""
Resume Answer Evaluation Service
ONE LLM call (rate-limit safe)
"""

from typing import List, Dict
from backend.services.evaluation_service.audio_transcriber import transcribe_audio
from backend.services.llm import call_llm
import json


def trim_answer(answer: str, max_words: int = 120) -> str:
    """Trim answer to specified word limit to reduce token usage"""
    words = answer.split()
    if len(words) > max_words:
        return " ".join(words[:max_words]) + "..."
    return answer


def evaluate_resume_answers(
    questions: List[str],
    audio_recordings: Dict[int, str]
) -> Dict:
    """
    Transcribe audio answers and evaluate them in ONE LLM call
    """

    transcripts = {}

    # Step 1: Transcribe all audio (mock)
    for idx, audio_base64 in audio_recordings.items():
        transcripts[int(idx)] = transcribe_audio(audio_base64)

    # Step 2: Prepare combined payload with trimmed answers
    qa_pairs = []
    for i, question in enumerate(questions):
        original_answer = transcripts.get(i, "No response provided")
        trimmed_answer = trim_answer(original_answer)
        
        qa_pairs.append({
            "question_index": i,
            "question": question,
            "answer": trimmed_answer
        })

    # Step 3: Evaluate each Q&A pair individually for precision
    responses = []
    for i, qa_pair in enumerate(qa_pairs):
        prompt = f"""
You are an interview evaluator.

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations
- Must be parsable by json.loads()

SCHEMA:
{{
  "question_index": {i},
  "relevance": number,
  "clarity": number,
  "completeness": number,
  "feedback": string
}}

EVALUATION CRITERIA:
- Relevance (1-3): How well does answer address the specific question asked?
- Clarity (1-3): How clear and articulate is the response?
- Completeness (1-3): How comprehensive is the answer?

SCORING RULES:
- If answer is generic/unrelated to question: relevance = 1
- If answer directly addresses question specifics: relevance = 2-3
- If answer is vague/unclear: clarity = 1
- If answer is well-structured: clarity = 2-3
- If answer is incomplete/brief: completeness = 1
- If answer is thorough/detailed: completeness = 2-3

CONTEXT:
Original Question: {qa_pair['question']}
Candidate Answer: {qa_pair['answer']}

Evaluate this specific Q&A pair using the criteria above.
"""
        
        try:
            raw = call_llm(prompt)
            response_data = json.loads(raw)
            
            # Extract individual scores
            response = {
                "question_index": i,
                "question": qa_pair['question'],
                "answer": qa_pair['answer'],
                "relevance": response_data.get("relevance", 2),
                "clarity": response_data.get("clarity", 2),
                "completeness": response_data.get("completeness", 2),
                "feedback": response_data.get("feedback", "Evaluation completed")
            }
            responses.append(response)
            
        except Exception as e:
            print(f"Resume Evaluation Error for Q{i}: {e}")
            # Fallback evaluation
            responses.append({
                "question_index": i,
                "question": qa_pair['question'],
                "answer": qa_pair['answer'],
                "relevance": 1,
                "clarity": 1,
                "completeness": 1,
                "feedback": "Evaluation error - using fallback scores"
            })

    return {"responses": responses}
