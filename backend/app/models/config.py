from datetime import datetime

from sqlmodel import Field, SQLModel


class SiteConfig(SQLModel, table=True):
    __tablename__ = "site_config"

    id: int = Field(default=1, primary_key=True)
    youtube_video_id: str = Field(default="", max_length=20)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
