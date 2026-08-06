import uuid
from datetime import date, datetime, time

from sqlmodel import Field, SQLModel


class TimeSlot(SQLModel, table=True):
    __tablename__ = "time_slot"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, nullable=False)
    slot_date: date = Field(nullable=False, index=True)
    slot_time: time = Field(nullable=False)
    is_available: bool = Field(default=True, nullable=False)
    reason_blocked: str | None = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
