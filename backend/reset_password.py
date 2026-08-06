import asyncio
from app.core.security import hash_password
from app.models.admin import Admin
from app.core.database import AsyncSessionLocal
from sqlmodel import select


async def reset():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Admin))
        admin = result.scalar_one_or_none()
        if admin:
            admin.hashed_password = hash_password("AdminMoon2026!")
            session.add(admin)
            await session.commit()
            print("Password reset OK — email:", admin.email)
        else:
            print("No admin found — running seed instead")


asyncio.run(reset())
