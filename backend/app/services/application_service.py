from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.application import Application
from app.schemas.application import ApplicationCreate
from app.core.config import settings


async def create_application(
    data: ApplicationCreate, session: AsyncSession
) -> Application:
    application = Application(
        full_name=data.full_name,
        email=data.email,
        role_interest=data.role_interest,
        portfolio_url=data.portfolio_url,
        message=data.message,
    )
    session.add(application)
    await session.flush()
    await session.refresh(application)

    if settings.EMAILS_ENABLED:
        try:
            await _send_notification(application)
        except Exception:
            pass

    return application


async def get_all_applications(session: AsyncSession) -> list[Application]:
    result = await session.execute(
        select(Application).order_by(Application.created_at.desc())
    )
    return result.scalars().all()


async def _send_notification(application: Application) -> None:
    import smtplib
    from email.mime.text import MIMEText

    body = (
        f"New team application received:\n\n"
        f"Name: {application.full_name}\n"
        f"Email: {application.email}\n"
        f"Role / Specialty: {application.role_interest}\n"
        f"Resume / Certification URL: {application.portfolio_url or 'N/A'}\n\n"
        f"About the applicant:\n{application.message}"
    )
    msg = MIMEText(body)
    msg["Subject"] = f"New Moon Ideas Application — {application.full_name}"
    msg["From"] = settings.SMTP_USER
    msg["To"] = settings.ADMIN_EMAIL

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as smtp:
        smtp.starttls()
        smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        smtp.send_message(msg)
