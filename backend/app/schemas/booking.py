import uuid
from datetime import datetime
from decimal import Decimal
from typing import List
from sqlmodel import SQLModel


class BookingCreate(SQLModel):
    slot_id: uuid.UUID
    client_name: str
    client_email: str
    client_phone: str | None = None
    service_type: str              # comma-joined display string
    selected_service_ids: List[int] = []
    notes: str | None = None
    estimated_price: Decimal = Decimal("0")


class BookingRead(SQLModel):
    id: uuid.UUID
    slot_id: uuid.UUID
    client_name: str
    client_email: str
    client_phone: str | None
    service_type: str
    notes: str | None
    estimated_price: Decimal
    created_at: datetime
