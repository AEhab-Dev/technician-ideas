import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.routers.config import get_current_admin
from app.schemas.booking import BookingCreate, BookingRead
from app.services import booking_service

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("", response_model=BookingRead, status_code=status.HTTP_201_CREATED)
async def create_booking(
    data: BookingCreate,
    session: AsyncSession = Depends(get_session),
):
    return await booking_service.create_booking(data, session)


@router.get("", response_model=list[BookingRead])
async def list_bookings(
    _: str = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    return await booking_service.get_all_bookings(session)


@router.get("/{booking_id}", response_model=BookingRead)
async def get_booking(
    booking_id: uuid.UUID,
    _: str = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    booking = await booking_service.get_booking(booking_id, session)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")
    return booking
