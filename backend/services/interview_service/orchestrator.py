# services/interview_service/orchestrator.py

PHASE_FLOW = ["aptitude", "technical", "dsa", "resume"]

def get_next_phase(current_phase: str):
    if current_phase not in PHASE_FLOW:
        return PHASE_FLOW[0]

    idx = PHASE_FLOW.index(current_phase)
    if idx + 1 < len(PHASE_FLOW):
        return PHASE_FLOW[idx + 1]

    return "completed"
