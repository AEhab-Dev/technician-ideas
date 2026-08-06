from datetime import datetime
from sqlmodel import Field, SQLModel


class SiteSettings(SQLModel, table=True):
    __tablename__ = "site_settings"

    id: int = Field(default=1, primary_key=True)

    # Contact
    phone: str = Field(default="(916) 530-7539", max_length=50)
    email: str = Field(default="Cammy@moonideas.com", max_length=255)

    # Social
    instagram_url: str = Field(default="https://instagram.com/moonideas", max_length=500)
    facebook_url: str = Field(default="https://facebook.com/moonideas", max_length=500)
    youtube_url: str = Field(default="", max_length=500)

    # Content
    footer_bio: str = Field(
        default="Professional auto repair and mechanic services. Reliable mobile service and drop-off service available.",
        max_length=1000,
    )
    hero_title: str = Field(default="Expert Auto Repair", max_length=255)
    hero_subtitle: str = Field(
        default="Mobile service and drop-off available. We come to you.",
        max_length=500,
    )
    hero_media_url: str = Field(default="", max_length=500)
    about_text: str = Field(default="", max_length=2000)

    # Legacy YouTube video ID (kept for backwards compat)
    youtube_video_id: str = Field(default="", max_length=20)

    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
