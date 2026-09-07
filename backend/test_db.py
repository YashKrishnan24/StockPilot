from app.db.session import SessionLocal
from app import models
from app.core import security

db = SessionLocal()
try:
    user = models.User(
        email="test2@example.com",
        password_hash=security.get_password_hash("password123"),
        name="Test 2",
    )
    db.add(user)
    db.flush()

    org = models.Organization(name="Test Org")
    db.add(org)
    db.flush()

    membership = models.Membership(
        user_id=user.id,
        organization_id=org.id,
        role="ADMIN"
    )
    db.add(membership)
    db.commit()
    print("Success!")
except Exception as e:
    import traceback
    traceback.print_exc()
