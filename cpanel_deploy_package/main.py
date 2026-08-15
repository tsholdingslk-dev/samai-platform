import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import models
from database import engine
from routers import auth, chat, project, api_provider, pdf_translate, coding, voice, media, image, agents, learning, api_proxy, lead_gen, crypto, auto_integrator, ai_intelligence
from routers.modules.module import router as module_router

# Create Database Tables
models.Base.metadata.create_all(bind=engine)

# Auto-seed Initial Admin User (sam@mail.com / 123456) if missing
try:
    from database import SessionLocal
    from security import get_password_hash
    db = SessionLocal()
    admin_user = db.query(models.User).filter(models.User.email == "sam@mail.com").first()
    if not admin_user:
        hashed_pwd = get_password_hash("123456")
        admin_user = models.User(
            id="admin_sam_01",
            email="sam@mail.com",
            hashed_password=hashed_pwd,
            role="admin"
        )

        db.add(admin_user)
        db.commit()
        print("Initial Admin User sam@mail.com created successfully!")
    db.close()
except Exception as e:
    print(f"Admin seeder notice: {e}")


app = FastAPI(
    title="SAM AI API",
    description="Backend Brain for SAM AI Platform",
    version="1.0.0"
)

# Include Routers
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(project.router)
app.include_router(api_provider.router)
app.include_router(module_router)
app.include_router(pdf_translate.router)
app.include_router(coding.router)
app.include_router(voice.router)
app.include_router(media.router)
app.include_router(image.router)
app.include_router(agents.router)
app.include_router(learning.router)
app.include_router(api_proxy.router)
app.include_router(lead_gen.router)
app.include_router(crypto.router)
app.include_router(auto_integrator.router)
app.include_router(ai_intelligence.router)


# CORS Setup for Frontend Connection
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "SAM AI Backend is Running 🚀"}
