# services/interview_service/prompts.py
APTITUDE_PROMPT = """
You are an aptitude interviewer.

Generate 5 multiple-choice questions.
Difficulty: {difficulty}

Rules:
- Each question must have 4 options
- Only ONE correct answer
- Do NOT explain answers
- Return STRICT JSON only

JSON format:
{{
  "questions": [
    {{
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct_index": 0
    }}
  ]
}}
"""


TECHNICAL_PROMPT = """
You are a technical interviewer.

Generate 5 multiple-choice technical questions.
Difficulty: {difficulty}

Rules:
- Only ONE correct answer
- 4 options per question
- Respond with ONLY valid JSON
- No explanations, no markdown

Return exactly:

{{
  "questions": [
    {{
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correct_index": 0
    }}
  ]
}}
"""


DSA_PROMPT = """
You are a DSA interview question generator.

Generate ONE coding problem.
Difficulty: {difficulty}

Rules (VERY IMPORTANT):
- Respond with ONLY valid JSON
- Do NOT include explanations
- Do NOT include markdown
- Do NOT include text before or after JSON
- Do NOT use ```json fences

Return EXACTLY in this format:

{{
  "title": "Problem title",
  "problem": "Clear problem statement",
  "constraints": "List of constraints",
  "example": "Input and output example"
}}
"""