import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "StockPilot"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your_super_secret_key_change_in_production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days

    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "stockpilot")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "stockpilot")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "stockpilot")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
    
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    @property
    def sync_database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return "sqlite:///./stockpilot.db"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
