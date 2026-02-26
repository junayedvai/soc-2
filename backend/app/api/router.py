from fastapi import APIRouter

from app.api.routes.alerts import router as alerts_router
from app.api.routes.incidents import router as incidents_router
from app.api.routes.logs import router as logs_router
from app.api.routes.compliance import router as compliance_router
from app.api.routes.audit import router as audit_router

api_router = APIRouter()
api_router.include_router(alerts_router, tags=["alerts"], prefix="/alerts")
api_router.include_router(incidents_router, tags=["incidents"], prefix="/incidents")
api_router.include_router(logs_router, tags=["logs"], prefix="/logs")
api_router.include_router(compliance_router, tags=["compliance"], prefix="/compliance")
api_router.include_router(audit_router, tags=["audit"], prefix="/audit")
