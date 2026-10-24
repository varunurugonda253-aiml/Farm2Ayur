"""Create demo users for the Farm2Ayur demo flow.
Passwords are typed when you run it and are never stored in this file.
Safe to run again: users whose email already exists are skipped."""
import getpass

import app.models  # noqa: F401  (loads all tables before we use them)
from app.database import SessionLocal, init_db
from app.models.user import User
from app.utils.auth import hash_password

DEMO_USERS = [
    dict(full_name="Collector Test", email="collector.test@example.com",
         role="collector", organization="Farm2Ayur"),
    dict(full_name="Verifier Test", email="verifier.test@example.com",
         role="verifier", organization="Farm2Ayur"),
]


def ask_password(email):
    while True:
        first = getpass.getpass(f"Choose a password for {email} (at least 8 characters): ")
        if len(first) < 8:
            print("Too short, try again.")
            continue
        if first != getpass.getpass("Type it again: "):
            print("The two passwords did not match, try again.")
            continue
        return first


def main():
    init_db()
    db = SessionLocal()
    try:
        for u in DEMO_USERS:
            if db.query(User).filter(User.email == u["email"]).first():
                print(f"SKIP  {u['email']} (already in database)")
                continue
            password = ask_password(u["email"])
            db.add(User(hashed_password=hash_password(password), **u))
            print(f"ADD   {u['email']} (role: {u['role']})")
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
    print("Done.")


if __name__ == "__main__":
    main()