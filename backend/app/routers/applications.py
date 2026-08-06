from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.routers.config import get_current_admin
from app.schemas.application import ApplicationCreate, ApplicationRead
from app.services import application_service

router = APIRouter(prefix="/applications", tags=["applications"])


@router.post("", response_model=ApplicationRead, status_code=status.HTTP_201_CREATED)
async def submit_application(
    data: ApplicationCreate,
    session: AsyncSession = Depends(get_session),
):
    return await application_service.create_application(data, session)


@router.get("", response_model=list[ApplicationRead])
async def list_applications(
    _: str = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    return await application_service.get_all_applications(session)
