import uuid
from datetime import date, time
from sqlmodel import SQLModel


class SlotCreate(SQLModel):
    slot_date: date
    slot_time: time


class SlotBlock(SQLModel):
    reason_blocked: str = "unavailable"


class SlotRead(SQLModel):
    id: uuid.UUID
    slot_date: date
    slot_time: time
    is_available: bool
    reason_blocked: str | None
