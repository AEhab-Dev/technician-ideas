import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel


class Application(SQLModel, table=True):
    __tablename__ = "application"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, nullable=False)
    full_name: str = Field(nullable=False, max_length=255)
    email: str = Field(nullable=False, max_length=255)
    role_interest: str = Field(nullable=False, max_length=100)
    portfolio_url: str | None = Field(default=None, max_length=500)
    message: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
