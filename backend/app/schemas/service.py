from typing import Optional
from sqlmodel import SQLModel


class ServiceCreate(SQLModel):
    name: str
    starting_price: float = 99.0
    description: str = ""
    is_active: bool = True
    sort_order: int = 0


class ServiceUpdate(SQLModel):
    name: Optional[str] = None
    starting_price: Optional[float] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class ServiceRead(SQLModel):
    id: int
    name: str
    starting_price: float
    description: str
    is_active: bool
    sort_order: int
