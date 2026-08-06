from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.security import decode_access_token
from app.models.config import SiteConfig
from app.schemas.config import YouTubeVideoIdRead, YouTubeVideoIdUpdate

router = APIRouter(prefix="/config", tags=["config"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_admin(
    token: str = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_session),
):
    subject = decode_access_token(token)
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return subject


@router.get("/youtube", response_model=YouTubeVideoIdRead)
async def get_youtube_id(session: AsyncSession = Depends(get_session)):
    config = await session.get(SiteConfig, 1)
    if not config:
        return YouTubeVideoIdRead(
            youtube_video_id="",
            updated_at=datetime.now(timezone.utc),
        )
    return config


@router.patch("/youtube", response_model=YouTubeVideoIdRead)
async def update_youtube_id(
    data: YouTubeVideoIdUpdate,
    _: str = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    config = await session.get(SiteConfig, 1)
    if not config:
        config = SiteConfig(id=1, youtube_video_id=data.youtube_video_id)
    else:
        config.youtube_video_id = data.youtube_video_id
        config.updated_at = datetime.now(timezone.utc)
    session.add(config)
    return config
