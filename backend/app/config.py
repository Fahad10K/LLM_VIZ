from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Model Configuration
    MODEL_NAME: str = "gpt2"
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    
    # Generation Parameters
    MAX_LENGTH: int = 1000
    TEMPERATURE: float = 0.7
    TOP_P: float = 0.9
    TOP_K: int = 50
    REPETITION_PENALTY: float = 1.2
    
    # API Configuration
    API_PREFIX: str = "/api/v1"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
