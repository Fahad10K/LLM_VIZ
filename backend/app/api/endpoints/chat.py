from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import sys
import os
import time
from fastapi import status

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from services.llm_service import llm_service

router = APIRouter()

class Message(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class HealthResponse(BaseModel):
    status: str
    models_loaded: bool
    loading_progress: float
    device: str

class ChatRequest(BaseModel):
    message: str
    temperature: float = 0.7
    max_tokens: int = 100

class VisualizationData(BaseModel):
    input_tokens: List[str]
    attention: List[List[float]]
    embeddings: List[List[float]]

class ChatResponse(BaseModel):
    response: str
    visualization_data: VisualizationData
    processing_time: float
    model_status: str

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Check the health and status of the LLM service."""
    return {
        "status": "initializing" if not llm_service.is_ready() else "ready",
        "models_loaded": llm_service.is_ready(),
        "loading_progress": llm_service.get_loading_progress(),
        "device": llm_service.device
    }

@router.post("", response_model=ChatResponse)
async def chat(chat_request: ChatRequest):
    """
    Process a chat message and return a response with visualization data.
    """
    try:
        start_time = time.time()
        
        # Generate response with visualization data
        result = await llm_service.generate_response(
            prompt=chat_request.message,
            temperature=chat_request.temperature,
            max_tokens=chat_request.max_tokens
        )
        
        processing_time = time.time() - start_time
        
        return {
            "response": result["response"],
            "visualization_data": result["visualization_data"],
            "processing_time": processing_time,
            "model_status": "ready" if llm_service.is_ready() else "initializing"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/embeddings")
async def get_embeddings(text: str):
    """
    Get embeddings for the given text.
    """
    try:
        embeddings = llm_service.get_embeddings(text)
        return {"embeddings": embeddings}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
