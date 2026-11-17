import os
import tempfile
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.models import Emergency
from app import crud
from app.schemas import EmergencyCreate


def test_sqlite_file_persistence():
    """Verify that records saved to a persistent SQLite database file survive session termination

    and engine recreation (simulating a container stop and restart).
    """
    with tempfile.TemporaryDirectory() as tmpdir:
        db_path = os.path.join(tmpdir, "test_careon.db")
        db_url = f"sqlite:///{db_path}"

        # Session 1: Create table and write an emergency record
        engine1 = create_engine(db_url, connect_args={"check_same_thread": False})
        Session1 = sessionmaker(bind=engine1)
        Base.metadata.create_all(bind=engine1)

        session1 = Session1()
        crud.seed_demo_data(session1)
        new_record = crud.create_emergency(
            session1,
            EmergencyCreate(
                patient_name="Persistent Patient",
                room_number="ICU-999",
                emergency_type="Cardiac",
                priority="Critical",
                description="Database persistence test subject",
            ),
        )
        saved_id = new_record.id
        session1.close()
        engine1.dispose()

        # Session 2: Connect with a brand new engine pointing to the same file
        engine2 = create_engine(db_url, connect_args={"check_same_thread": False})
        Session2 = sessionmaker(bind=engine2)

        session2 = Session2()
        reloaded = crud.get_emergency_by_id(session2, saved_id)
        assert reloaded is not None
        assert reloaded.patient_name == "Persistent Patient"
        assert reloaded.room_number == "ICU-999"
        assert reloaded.priority == "Critical"

        stats = crud.get_stats(session2)
        assert stats["total"] >= 4
        session2.close()
        engine2.dispose()
