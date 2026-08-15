import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "samai.db")

db_url = os.getenv("DATABASE_URL")
if not db_url or db_url == "sqlite:///./samai.db":
    db_url = f"sqlite:///{DB_FILE}"

try:
    if db_url.startswith("sqlite"):
        engine = create_engine(db_url, connect_args={"check_same_thread": False})
    else:
        engine = create_engine(db_url, pool_pre_ping=True, connect_args={"connect_timeout": 2})
        conn = engine.connect()
        conn.close()
except Exception as e:
    db_url = f"sqlite:///{DB_FILE}"
    engine = create_engine(db_url, connect_args={"check_same_thread": False})



# Create a SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a Base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
