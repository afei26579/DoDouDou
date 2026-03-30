from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1 import router as api_v1_router
from app.core.cache import cache_client


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        debug=settings.DEBUG,
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Startup event
    @app.on_event("startup")
    async def startup_event():
        """Initialize services on startup"""
        await cache_client.connect()

    # Shutdown event
    @app.on_event("shutdown")
    async def shutdown_event():
        """Cleanup on shutdown"""
        await cache_client.disconnect()

    # Include API router
    app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)

    @app.get("/")
    async def root():
        return {
            "message": "拼豆豆助手 API",
            "version": settings.VERSION,
            "docs": "/docs" if settings.DEBUG else None,
        }

    @app.get("/health")
    async def health_check():
        return {
            "status": "healthy",
            "version": settings.VERSION,
        }

    return app


app = create_app()
