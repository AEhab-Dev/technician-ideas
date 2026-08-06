from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.models.site_settings import SiteSettings
from app.routers.config import get_current_admin
from app.schemas.site_settings import SiteSettingsRead, SiteSettingsUpdate

router = APIRouter(prefix="/settings", tags=["settings"])


async def _get_or_create(session: AsyncSession) -> SiteSettings:
    settings = await session.get(SiteSettings, 1)
    if not settings:
        settings = SiteSettings(id=1)
        session.add(settings)
        await session.flush()
        await session.refresh(settings)
    return settings


@router.get("", response_model=SiteSettingsRead)
async def get_settings(session: AsyncSession = Depends(get_session)):
    return await _get_or_create(session)


@router.patch("", response_model=SiteSettingsRead)
async def update_settings(
    data: SiteSettingsUpdate,
    _: str = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    settings = await _get_or_create(session)
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(settings, field, value)
    settings.updated_at = datetime.utcnow()
    session.add(settings)
    return settings
