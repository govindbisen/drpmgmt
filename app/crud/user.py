from sqlalchemy.orm import Session
from app.models.user import UserDB
from app.schemas.user import UserCreate
from app.utils.security import hash_password

from fastapi import HTTPException

def create_user(db: Session, user):
    existing = db.query(UserDB).filter(UserDB.username == user.username).first()

    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = UserDB(
        username=user.username,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
  