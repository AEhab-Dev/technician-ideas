import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.routers.config import get_current_admin
from app.schemas.slot import SlotBlock, SlotCreate, SlotRead
from app.services import slot_service

router = APIRouter(prefix="/slots", tags=["slots"])


@router.get("", response_model=list[SlotRead])
async def list_slots(
    month: str = Query(..., description="Format: YYYY-MM e.g. 2026-08"),
    session: AsyncSession = Depends(get_session),
):
    return await slot_service.get_slots_for_month(month, session)


@router.post("", response_model=SlotRead, status_code=status.HTTP_201_CREATED)
async def create_slot(
    data: SlotCreate,
    _: str = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    return await slot_service.create_slot(data, session)


@router.patch("/{slot_id}/block", response_model=SlotRead)
async def block_slot(
    slot_id: uuid.UUID,
    data: SlotBlock,
    _: str = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    slot = await slot_service.block_slot(slot_id, data.reason_blocked, session)
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found.")
    return slot


@router.patch("/{slot_id}/unblock", response_model=SlotRead)
async def unblock_slot(
    slot_id: uuid.UUID,
    _: str = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    slot = await slot_service.unblock_slot(slot_id, session)
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found.")
    return slot


@router.delete("/{slot_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_slot(
    slot_id: uuid.UUID,
    _: str = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    deleted = await slot_service.delete_slot(slot_id, session)
    if not deleted:
        raise HTTPException(status_code=404, detail="Slot not found.")
