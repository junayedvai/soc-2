from fastapi import APIRouter
from pydantic import BaseModel

from app.models import LogParseRequest, LogParseResponse
from app.services.ai_engine import parse_logs, ai_explain

router = APIRouter()


@router.post("/parse", response_model=LogParseResponse)
def parse(req: LogParseRequest):
    events = parse_logs(req.raw)
    return LogParseResponse(events=events, ai_explanation=ai_explain(events))
