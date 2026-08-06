import uuid
from datetime import datetime
from sqlmodel import SQLModel


class ApplicationCreate(SQLModel):
    full_name: str
    email: str
    role_interest: str
    portfolio_url: str | None = None
    message: str


class ApplicationRead(SQLModel):
    id: uuid.UUID
    full_name: str
    email: str
    role_interest: str
    portfolio_url: str | None
    message: str
    created_at: datetime
