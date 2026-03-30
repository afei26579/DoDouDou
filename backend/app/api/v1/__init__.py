"""
API v1 Router
"""
from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.convert import router as convert_router

router = APIRouter()

# Include sub-routers
router.include_router(auth_router)
router.include_router(convert_router)


@router.get("/ping")
async def ping():
    """Health check endpoint"""
    return {"message": "pong"}
