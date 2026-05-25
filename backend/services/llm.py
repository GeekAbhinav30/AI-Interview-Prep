"""
Groq LLM service for question generation with intelligent caching
"""
import json
import hashlib
import os
from typing import Dict, Any
from groq import Groq
from backend.config import GROQ_API_KEY
from backend.utils.logger import debug_log
import time

# Initialize Groq client
client = None
if GROQ_API_KEY:
    try:
        client = Groq(api_key=GROQ_API_KEY, timeout=60.0)  # 60 second timeout
        print("✅ Groq client initialized successfully")
    except Exception as e:
        print(f"❌ Groq client initialization failed: {e}")
        client = None
else:
    print("⚠️ Groq API key not configured")
    client = None

CACHE_FILE = "llm_cache.json"
llm_cache: Dict[str, str] = {}

def load_cache():
    """Load cache from disk"""
    global llm_cache
    try:
        if os.path.exists(CACHE_FILE):
            with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                llm_cache = json.load(f)
            print(f"📂 Loaded {len(llm_cache)} cached responses")
    except Exception as e:
        print(f"⚠️ Cache load error: {e}")
        llm_cache = {}

def save_cache():
    """Save cache to disk"""
    try:
        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(llm_cache, f, indent=2)
    except Exception as e:
        print(f"⚠️ Cache save error: {e}")

def normalize_prompt(prompt: str) -> str:
    """Normalize prompt for consistent hashing"""
    return " ".join(prompt.lower().strip().split())

def get_prompt_hash(prompt: str) -> str:
    """Generate SHA-256 hash of normalized prompt"""
    normalized = normalize_prompt(prompt)
    return hashlib.sha256(normalized.encode('utf-8')).hexdigest()

def extract_json_from_response(response_text: str) -> str:
    """Extract JSON content from LLaMA response, removing markdown fences"""
    # Remove markdown code blocks if present
    if "```json" in response_text:
        start = response_text.find("```json") + 7
        end = response_text.find("```", start)
        if end != -1:
            return response_text[start:end].strip()
    elif "```" in response_text:
        start = response_text.find("```") + 3
        end = response_text.find("```", start)
        if end != -1:
            return response_text[start:end].strip()
    
    # Return as-is if no markdown found
    return response_text.strip()

# Load cache at startup
load_cache()


def call_llm(prompt: str) -> str:
    """
    Generic Groq LLM caller for non-resume interview rounds
    (aptitude, technical, dsa) with intelligent caching
    """
    if not client:
        raise ValueError("Groq API key not configured")

    # Check cache first
    prompt_hash = get_prompt_hash(prompt)
    
    if prompt_hash in llm_cache:
        print("🚀 Cache HIT")
        return llm_cache[prompt_hash]
    
    print("📡 Cache MISS - Calling Groq")
    
    try:
        start_time = time.time()
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_completion_tokens=4096,
            stream=False
        )
        
        raw_response = response.choices[0].message.content
        clean_response = extract_json_from_response(raw_response)
        
        # Cache the result
        llm_cache[prompt_hash] = clean_response
        save_cache()
        
        call_time = time.time() - start_time
        print(f"✅ Groq call completed in {call_time:.2f}s")
        
        return clean_response
        
    except Exception as e:
        print(f"❌ Groq API error: {e}")
        # Return partial JSON to prevent frontend crashes
        if "judge" in prompt.lower() or "feedback" in prompt.lower():
            return '{"strengths": ["System processed your responses"], "weaknesses": ["Areas for improvement identified"], "final_verdict": "Borderline"}'
        else:
            return "{}"


def generate_questions(resume_context: str, job_description: str) -> list:
    """
    Generate resume-based interview questions using Groq LLM
    (USED ONLY for resume interview) with intelligent caching
    """
    start_groq = time.time()

    debug_log(
        "llm_service.py:generate_questions",
        "groq_api_call_start",
        {"prompt_length": len(resume_context) + len(job_description)},
        "D",
    )

    if not client:
        raise ValueError("Groq API key not configured")

    prompt = f"""
You are a Lead Technical Interviewer and Hiring Manager at a Tier-1 technology company, with deep experience in evaluating candidates for production-grade systems, scalability, and real-world engineering challenges.

Your objective is to generate a highly realistic and context-aware set of interview questions using the candidate's resume and the provided job description.

You must think like a senior interviewer who prioritizes:
- Real-world problem solving
- System scalability and design thinking
- Depth of implementation knowledge
- Practical decision-making under constraints
- Alignment with production-level expectations

---

## 🧠 INTERNAL REASONING PROCESS (DO NOT OUTPUT THIS)

Before generating questions, internally perform the following:

1. Identify the most technically significant and complex elements in the candidate's resume:
   - Key projects
   - Technologies used
   - Claims of impact (e.g., performance improvements, scalability, optimizations)

2. Identify the most critical requirements and expectations from the job description:
   - Core technologies
   - Responsibilities
   - Required skills and competencies

3. Cross-analyze both:
   - Find overlaps (strength areas)
   - Find gaps (missing or weak alignment)
   - Identify areas that require deeper validation

Use this internal analysis to generate high-quality, targeted questions.

DO NOT output this reasoning.

---

## 🎯 TOTAL QUESTIONS REQUIRED

Generate EXACTLY 15 to 16 interview questions.

---

## 📊 QUESTION DISTRIBUTION (MANDATORY BUT NOT EXPLICITLY LABELED)

- 5–6 questions must deeply probe the candidate's resume (projects, experience, decisions, challenges)
- 4–5 questions must evaluate behavioral and situational judgment
- 4–5 questions must align with the job description requirements and expectations

Do NOT label or group them in output.

---

## 🧠 QUESTION QUALITY STANDARDS

- Every question MUST be context-aware:
  → Reference specific technologies, tools, projects, or responsibilities mentioned in the resume or JD

- Avoid generic questions such as:
  → "What is Python?"
  → "Explain OOP concepts"

- Prefer:
  → Scenario-based
  → Experience-driven
  → "Why" and "How" focused questions
  → Questions that require reasoning, trade-offs, and decision explanation

- If the resume mentions:
  → performance improvements → ask for baseline vs final metrics
  → scalability → ask how system behaves under increased load
  → tools/frameworks → ask why they were chosen

- Ensure diversity in questioning style:
  → Do not repeat patterns
  → Avoid templated phrasing

---

## ⚠️ STRICT OUTPUT CONSTRAINTS (CRITICAL)

You MUST follow ALL rules below:

- Output ONLY interview questions
- DO NOT include explanations, reasoning, or commentary
- DO NOT include phrases such as:
  - "Why this question"
  - "This question evaluates"
  - "Tip"
  - "You should mention"
  - "The interviewer is looking for"
- DO NOT include advice or guidance
- DO NOT include numbering (1., 2., etc.)
- DO NOT include bullet points (*, -, etc.)
- DO NOT include headings or sections
- DO NOT include any introductory or concluding text
- Each question must be on a NEW LINE
- Each line must contain EXACTLY one question

---

## ❌ INVALID OUTPUT (MUST NEVER OCCUR)

- Any explanation text
- Any coaching or tips
- Any meta-commentary
- Any structured formatting beyond plain questions

---

## 📌 CONTEXT

Resume Context:
{resume_context}

Job Description:
{job_description}

---

## 🧠 FINAL INSTRUCTION

Generate only the interview questions using the above reasoning process and constraints.

The output must:
- Be realistic and interviewer-grade
- Be highly relevant to the provided context
- Contain ONLY clean questions
- Follow all constraints strictly
"""

    # Check cache first
    prompt_hash = get_prompt_hash(prompt)
    
    if prompt_hash in llm_cache:
        print("🚀 Cache HIT for resume questions")
        cached_response = llm_cache[prompt_hash]
        questions = [
            q.strip()
            for q in cached_response.split("\n")
            if q.strip()
        ]
        
        groq_time = time.time() - start_groq
        debug_log(
            "llm_service.py:generate_questions",
            "groq_cache_hit_complete",
            {"time_seconds": groq_time, "question_count": len(questions)},
            "D",
        )
        
        return questions
    
    print("📡 Cache MISS - Calling Groq for resume questions")
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_completion_tokens=4096,
            stream=False
        )

        raw_response = response.choices[0].message.content
        clean_response = extract_json_from_response(raw_response)
        
        questions = [
            q.strip()
            for q in clean_response.split("\n")
            if q.strip()
        ]

        # Cache the result
        llm_cache[prompt_hash] = clean_response
        save_cache()

        groq_time = time.time() - start_groq

        debug_log(
            "llm_service.py:generate_questions",
            "groq_api_call_complete",
            {"time_seconds": groq_time, "question_count": len(questions)},
            "D",
        )

        return questions

    except Exception as e:
        print(f"❌ Groq API error in generate_questions: {e}")
        debug_log(
            "llm_service.py:generate_questions",
            "groq_api_error",
            {"error": str(e)},
            "E",
        )
        return []
