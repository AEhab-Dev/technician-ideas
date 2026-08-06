from datetime import datetime
from sqlmodel import SQLModel


class YouTubeVideoIdUpdate(SQLModel):
    youtube_video_id: str


class YouTubeVideoIdRead(SQLModel):
    youtube_video_id: str
    updated_at: datetime
