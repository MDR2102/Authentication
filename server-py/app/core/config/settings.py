from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[4]


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    mongodb_uri: str = Field(alias="MONGODB_URI")
    mongodb_db_name: str = Field(alias="MONGODB_DB_NAME")
    jwt_access_secret: str = Field(alias="JWT_ACCESS_SECRET")
    jwt_refresh_secret: str = Field(alias="JWT_REFRESH_SECRET")
    access_token_expire_minutes: int = Field(alias="ACCESS_TOKEN_EXPIRE_MINUTES", default=15)
    refresh_token_expire_days: int = Field(alias="REFRESH_TOKEN_EXPIRE_DAYS", default=7)
    client_origin: str = Field(alias="CLIENT_ORIGIN", default="http://localhost:5173")
    port: int = Field(alias="PORT", default=5000)
    environment: str = Field(alias="NODE_ENV", default="development")

    model_config = SettingsConfigDict(
        env_file="C:/Users/ManishDharawaniya/Documents/authentication/authentication/.env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()
