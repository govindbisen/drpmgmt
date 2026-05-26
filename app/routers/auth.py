from fastapi import APIRouter, HTTPException
from app.schemas.user import UserCreate
from app.utils.security import (
    verify_password,
    hash_password
)

from app.utils.token import create_access_token
from app.db.postgres import conn, cursor
router = APIRouter(prefix="/auth")

@router.post("/signup")
def signup(user: UserCreate):
    cursor.execute(
        "SELECT * FROM users WHERE username=%s",
        (user.username,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    hashed_password = hash_password(user.password)

    # insert user
    cursor.execute(
        """
        INSERT INTO users(username, password, role)
        VALUES(%s, %s, %s)
        """,
        (user.username, hashed_password, "user")
    )

    conn.commit()

    return {
        "message": "User created successfully"
    }


@router.post("/login")
def login(user: UserCreate):

    cursor.execute(
        "SELECT * FROM users WHERE username=%s",
        (user.username,)
    )

    db_user = cursor.fetchone()

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not verify_password(
        user.password,
        db_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    token = create_access_token({
        "sub": db_user["username"],
        "role": db_user["role"]
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }