"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel
from typing import Optional, List

class FrameRequest(BaseModel):
    session_id: str
    frame: str

class SessionRequest(BaseModel):
    session_id: str

class RoomScanComplete(BaseModel):
    session_id: str
    passed: bool

