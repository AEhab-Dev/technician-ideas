from typing import Optional
from sqlmodel import SQLModel


class SiteSettingsUpdate(SQLModel):
    phone: Optional[str] = None
    email: Optional[str] = None
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    youtube_url: Optional[str] = None
    footer_bio: Optional[str] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_media_url: Optional[str] = None
    about_text: Optional[str] = None
    youtube_video_id: Optional[str] = None


class SiteSettingsRead(SQLModel):
    phone: str
    email: str
    instagram_url: str
    facebook_url: str
    youtube_url: str
    footer_bio: str
    hero_title: str
    hero_subtitle: str
    hero_media_url: str
    about_text: str
    youtube_video_id: str
