from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class Service(SQLModel, table=True):
    __tablename__ = "service"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(nullable=False, max_length=255)
    starting_price: float = Field(nullable=False, default=99.0)
    description: str = Field(default="", nullable=False)
    is_active: bool = Field(default=True, nullable=False)
    sort_order: int = Field(default=0, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
