import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel


class Admin(SQLModel, table=True):
    __tablename__ = "admin"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, nullable=False)
    email: str = Field(unique=True, index=True, nullable=False, max_length=255)
    hashed_password: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
