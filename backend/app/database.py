import os
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./careon.db")

# Normalize PostgreSQL URL scheme (many cloud providers like Neon/Render provide postgres:// or postgresql://)
# In SQLAlchemy 2.0, explicit postgresql+psycopg2:// ensures psycopg2-binary driver is used
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

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

# Engine configuration: SQLite vs PostgreSQL
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
    )
else:
    # Production PostgreSQL pool configuration (Neon, Render, Supabase)
    pool_size = int(os.getenv("DB_POOL_SIZE", "10"))
    max_overflow = int(os.getenv("DB_MAX_OVERFLOW", "20"))
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=pool_size,
        max_overflow=max_overflow,
    )
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_migration_statements(dialect_name: str) -> list:
    """Return (column_name, sql_statement) pairs tailored for the database dialect."""
    is_pg = dialect_name == "postgresql"
    dt_type = "TIMESTAMP WITH TIME ZONE" if is_pg else "DATETIME"
    return [
        ("otp_hash", "ALTER TABLE incidents ADD COLUMN otp_hash VARCHAR(255)"),
        ("otp_expires_at", f"ALTER TABLE incidents ADD COLUMN otp_expires_at {dt_type}"),
        ("otp_attempts", "ALTER TABLE incidents ADD COLUMN otp_attempts INTEGER DEFAULT 0"),
    ]


def _is_duplicate_column_error(e: Exception) -> bool:
    """Identify if error is benign race condition where column was already added by concurrent instance."""
    err_msg = str(e).lower()
    return (
        "duplicate column" in err_msg
        or "already exists" in err_msg
        or getattr(getattr(e, "orig", None), "pgcode", None) == "42701"
    )


def run_db_migrations(target_engine):
    """
    Non-destructive database migration helper.
    Ensures newly added columns exist in existing tables (SQLite & PostgreSQL).
    Does not drop or recreate tables.
    Rethrows unexpected errors so migration failures are visible.
    """
    inspector = inspect(target_engine)
    existing_tables = inspector.get_table_names()
    if "incidents" in existing_tables:
        columns = {col["name"] for col in inspector.get_columns("incidents")}
        dialect_name = getattr(target_engine.dialect, "name", "sqlite")
        statements = get_migration_statements(dialect_name)
        for col_name, stmt in statements:
            if col_name not in columns:
                try:
                    with target_engine.begin() as conn:
                        conn.execute(text(stmt))
                except Exception as e:
                    if _is_duplicate_column_error(e):
                        continue
                    raise

    if "notifications" in existing_tables:
        notif_cols = {col["name"] for col in inspector.get_columns("notifications")}
        notif_statements = [
            ("target_role", "ALTER TABLE notifications ADD COLUMN target_role VARCHAR(20) DEFAULT 'user'"),
            ("action_url", "ALTER TABLE notifications ADD COLUMN action_url VARCHAR(200)"),
        ]
        for col_name, stmt in notif_statements:
            if col_name not in notif_cols:
                try:
                    with target_engine.begin() as conn:
                        conn.execute(text(stmt))
                except Exception as e:
                    if _is_duplicate_column_error(e):
                        continue
                    raise


def get_db():
    """Dependency for obtaining a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
