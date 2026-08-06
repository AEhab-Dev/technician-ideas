import asyncio
import sys

from sqlmodel import select

from app.core.database import AsyncSessionLocal, create_db_and_tables
from app.core.security import hash_password
from app.core.config import settings
from app.models.admin import Admin
from app.models.config import SiteConfig
from app.models.site_settings import SiteSettings
from app.models.service import Service

# Fix Windows console encoding
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

DEFAULT_SERVICES = [
    {"name": "Oil Changes", "starting_price": 99, "description": "Conventional, synthetic blend, or full synthetic oil change with filter replacement.", "sort_order": 1},
    {"name": "Brake Jobs", "starting_price": 99, "description": "Brake pad replacement, rotor resurfacing or replacement, and brake inspection.", "sort_order": 2},
    {"name": "Batteries (Replacement/Jump)", "starting_price": 99, "description": "Battery testing, jump starts, and full battery replacement on-site.", "sort_order": 3},
    {"name": "Cooling Systems", "starting_price": 99, "description": "Coolant flush, radiator inspection, thermostat replacement, and leak diagnosis.", "sort_order": 4},
    {"name": "Engine Diagnostics & Tune Ups", "starting_price": 99, "description": "OBD scan, spark plug replacement, air filter, and full tune-up service.", "sort_order": 5},
    {"name": "Emergency Fuel Delivery", "starting_price": 99, "description": "Stranded with an empty tank? We'll bring fuel directly to your location.", "sort_order": 6},
    {"name": "Pulleys & Belts", "starting_price": 99, "description": "Serpentine belt, timing belt, tensioner, and pulley inspection and replacement.", "sort_order": 7},
]


async def seed():
    await create_db_and_tables()

    async with AsyncSessionLocal() as session:
        # Admin user
        result = await session.execute(select(Admin).where(Admin.email == settings.ADMIN_EMAIL))
        existing_admin = result.scalar_one_or_none()
        if not existing_admin:
            session.add(Admin(
                email=settings.ADMIN_EMAIL,
                hashed_password=hash_password(settings.ADMIN_PASSWORD),
            ))
            print(f"[OK] Admin created: {settings.ADMIN_EMAIL}")
        else:
            print(f"[--] Admin already exists: {settings.ADMIN_EMAIL}")

        # Legacy site config
        config = await session.get(SiteConfig, 1)
        if not config:
            session.add(SiteConfig(id=1, youtube_video_id=""))
            print("[OK] Legacy site config created.")

        # Site settings
        site = await session.get(SiteSettings, 1)
        if not site:
            session.add(SiteSettings(id=1))
            print("[OK] Site settings created.")
        else:
            print("[--] Site settings already exist.")

        # Default services
        existing = await session.execute(select(Service))
        if not existing.scalars().first():
            for svc in DEFAULT_SERVICES:
                session.add(Service(**svc))
            print(f"[OK] {len(DEFAULT_SERVICES)} default services seeded.")
        else:
            print("[--] Services already exist.")

        await session.commit()
        print("\nSeed complete.")


if __name__ == "__main__":
    asyncio.run(seed())
