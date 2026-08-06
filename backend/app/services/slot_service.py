import uuid
from calendar import monthrange
from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.slot import TimeSlot
from app.schemas.slot import SlotCreate


async def get_slots_for_month(month: str, session: AsyncSession) -> list[TimeSlot]:
    try:
        year, mon = month.split("-")
        y, m = int(year), int(mon)
    except ValueError:
        return []

    last_day = monthrange(y, m)[1]
    start = date(y, m, 1)
    end = date(y, m, last_day)

    result = await session.execute(
        select(TimeSlot)
        .where(TimeSlot.slot_date >= start)
        .where(TimeSlot.slot_date <= end)
        .order_by(TimeSlot.slot_date, TimeSlot.slot_time)
    )
    return result.scalars().all()


async def create_slot(data: SlotCreate, session: AsyncSession) -> TimeSlot:
    slot = TimeSlot(slot_date=data.slot_date, slot_time=data.slot_time)
    session.add(slot)
    await session.flush()
    await session.refresh(slot)
    return slot


async def block_slot(
    slot_id: uuid.UUID, reason: str, session: AsyncSession
) -> TimeSlot | None:
    slot = await session.get(TimeSlot, slot_id)
    if not slot:
        return None
    slot.is_available = False
    slot.reason_blocked = reason
    session.add(slot)
    await session.flush()
    await session.refresh(slot)
    return slot


async def unblock_slot(
    slot_id: uuid.UUID, session: AsyncSession
) -> TimeSlot | None:
    slot = await session.get(TimeSlot, slot_id)
    if not slot:
        return None
    slot.is_available = True
    slot.reason_blocked = None
    session.add(slot)
    await session.flush()
    await session.refresh(slot)
    return slot


async def delete_slot(slot_id: uuid.UUID, session: AsyncSession) -> bool:
    slot = await session.get(TimeSlot, slot_id)
    if not slot:
        return False
    await session.delete(slot)
    return True
