import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.booking import Booking
from app.models.slot import TimeSlot
from app.schemas.booking import BookingCreate


async def create_booking(data: BookingCreate, session: AsyncSession) -> Booking:
    slot = await session.get(TimeSlot, data.slot_id)
    if not slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Time slot not found.",
        )
    if not slot.is_available:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This time slot is no longer available.",
        )

    slot.is_available = False
    slot.reason_blocked = "booked"
    session.add(slot)

    booking = Booking(
        slot_id=data.slot_id,
        client_name=data.client_name,
        client_email=data.client_email,
        client_phone=data.client_phone,
        service_type=data.service_type,
        notes=data.notes,
        estimated_price=data.estimated_price,
    )
    session.add(booking)
    await session.flush()
    await session.refresh(booking)
    return booking


async def get_all_bookings(session: AsyncSession) -> list[Booking]:
    result = await session.execute(
        select(Booking).order_by(Booking.created_at.desc())
    )
    return result.scalars().all()


async def get_booking(booking_id: uuid.UUID, session: AsyncSession) -> Booking | None:
    return await session.get(Booking, booking_id)
