import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./careon.db")

# Ensure directory exists if SQLite file path is specified
if DATABASE_URL.startswith("sqlite:///"):
    db_path = DATABASE_URL.replace("sqlite:///", "")
    # Handle absolute paths like sqlite:////data/careon.db
    if db_path.startswith("/"):
        dir_name = os.path.dirname(db_path)
    else:
        dir_name = os.path.dirname(os.path.abspath(db_path))
    if dir_name and not os.path.exists(dir_name):
        try:
            os.makedirs(dir_name, exist_ok=True)
        except OSError:
            pass

# Connect args needed for SQLite thread handling
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency for obtaining a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
