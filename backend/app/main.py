from fastapi import FastAPI, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
import os
import sys
import time
import logging
from pathlib import Path
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the backend directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

# Import routers
from app.api.endpoints import chat as chat_endpoints
from app.services.llm_service import llm_service
from app.config import settings

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load models in the background
    logger.info("Starting up... Loading ML models in the background...")
    
    # Load models in the background
    import asyncio
    asyncio.create_task(llm_service._load_models())
    
    # Initial health check
    app.state.ready = False
    app.state.startup_time = time.time()
    
    yield
    
    # Shutdown: Clean up resources
    logger.info("Shutting down... Cleaning up...")
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
    app.state.ready = False

app = FastAPI(
    title="LLM Personal Assistant API",
    description="API for custom LLM personal assistant",
    version="1.0.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
    lifespan=lifespan
)

# Configure CORS with more secure defaults
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Process-Time"],
)

# Add exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": exc.body},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"},
    )

# Add middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Include API routers
app.include_router(
    chat_endpoints.router,
    prefix="/api/v1/chat",
    tags=["chat"]
)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "LLM Personal Assistant API",
        "status": "running",
        "uptime": time.time() - app.state.startup_time if hasattr(app.state, 'startup_time') else 0,
        "ready": app.state.ready if hasattr(app.state, 'ready') else False
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "model_loaded": llm_service.model is not None,
        "device": llm_service.device
    }

# Model info endpoint
@app.get("/api/v1/model/info")
async def get_model_info():
    return {
        "model_name": settings.MODEL_NAME,
        "model_description": "A smaller, faster, cheaper version of GPT-2",
        "parameters": {
            "max_length": settings.MAX_LENGTH,
            "temperature": settings.TEMPERATURE,
            "top_p": settings.TOP_P,
            "top_k": settings.TOP_K,
            "repetition_penalty": settings.REPETITION_PENALTY
        }
    }

# Import torch here to avoid circular imports
import torch

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=1
    )
