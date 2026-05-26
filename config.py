from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ticketmaster_api_key: str = ""
    seatgeek_client_id: str = ""
    seatgeek_client_secret: str = ""
    eventbrite_api_key: str = ""
    cache_ttl_seconds: int = 600
    redis_url: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
