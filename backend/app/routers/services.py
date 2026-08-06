from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.database import get_session
from app.models.service import Service
from app.routers.config import get_current_admin
from app.schemas.service import ServiceCreate, ServiceRead, ServiceUpdate

router = APIRouter(prefix="/services", tags=["services"])


@router.get("", response_model=list[ServiceRead])
async def list_services(session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Service)
        .where(Service.is_active == True)
        .order_by(Service.sort_order, Service.id)
    )
    return result.scalars().all()


@router.get("/all", response_model=list[ServiceRead])
async def list_all_services(
    _: str = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    """Admin-only: returns all services including inactive ones."""
    result = await session.execute(
        select(Service).order_by(Service.sort_order, Service.id)
    )
    return result.scalars().all()


@router.post("", response_model=ServiceRead, status_code=status.HTTP_201_CREATED)
async def create_service(
    data: ServiceCreate,
    _: str = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    service = Service(**data.model_dump())
    session.add(service)
    await session.flush()
    await session.refresh(service)
    return service


@router.patch("/{service_id}", response_model=ServiceRead)
async def update_service(
    service_id: int,
    data: ServiceUpdate,
    _: str = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    service = await session.get(Service, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found.")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(service, field, value)
    service.updated_at = datetime.utcnow()
    session.add(service)
    await session.flush()
    await session.refresh(service)
    return service


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(
    service_id: int,
    _: str = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    service = await session.get(Service, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found.")
    await session.delete(service)
