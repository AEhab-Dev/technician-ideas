import uuid
from datetime import datetime
from decimal import Decimal

from sqlmodel import Field, SQLModel


class Booking(SQLModel, table=True):
    __tablename__ = "booking"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, nullable=False)
    slot_id: uuid.UUID = Field(foreign_key="time_slot.id", nullable=False, index=True)
    client_name: str = Field(nullable=False, max_length=255)
    client_email: str = Field(nullable=False, max_length=255)
    client_phone: str | None = Field(default=None, max_length=50)
    service_type: str = Field(nullable=False, max_length=100)
    notes: str | None = Field(default=None)
    estimated_price: Decimal = Field(default=Decimal("0"), max_digits=10, decimal_places=2)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
