from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import create_db_and_tables
from app.routers import auth, bookings, applications
from app.routers import config as config_router
from app.routers import slots, services, settings as settings_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield


app = FastAPI(
    title="Moon Ideas API",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(config_router.router)
app.include_router(slots.router)
app.include_router(bookings.router)
app.include_router(applications.router)
app.include_router(services.router)
app.include_router(settings_router.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "Moon Ideas API"}
