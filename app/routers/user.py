from fastapi import APIRouter
from fastapi import HTTPException

from app.schemas.user import(
    UserCreate,
    UserUpdate
)

from app.utils.security import(
    hash_password
)

from app.db.postgres import(
    conn,cursor
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/")
def create_user(user:UserCreate):
    cursor.execute(
        """SELECT * FROM USERS WHERE USERNAME = %s""",
        (user.username,)
    )
    existing_user = cursor.fetchone()
    if existing_user:
        raise HTTPException(status_code=400,detail="Username already exists")
    hashed_password = hash_password(
        user.password
    )
    cursor.execute(
        """
        INSERT INTO users(
            username,
            email,
            password,
            role
        )
        VALUES(%s, %s, %s, %s)
        """,
        (
            user.username,
            user.email,
            hashed_password,
            user.role
        )
    )


@router.get("/")
def get_users():
    cursor.execute(
        """
        SELECT id,
               username,
               email,
               role
        FROM users
        """
    )
    users = cursor.fetchall()
    return users

@router.get("/{id}")
def get_single_user(id: int):
    cursor.execute(
        """
        SELECT id,
               username,
               email,
               role
        FROM users
        WHERE id=%s
        """,
        (id,)
    )
    user = cursor.fetchone()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    return user


@router.put("/{id}")
def update_user(
    id: int,
    user: UserUpdate
):
    # pehle existing user check
    cursor.execute(
        """
        SELECT * FROM users
        WHERE id=%s
        """,
        (id,)
    )
    existing_user = cursor.fetchone()
    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    username = (
        user.username
        if user.username is not None
        else existing_user["username"]
    )

    email = (
        user.email
        if user.email is not None
        else existing_user["email"]
    )
    role = (
        user.role
        if user.role is not None
        else existing_user["role"]
    )
    password = existing_user["password"]
    if user.password is not None:
        password = hash_password(
            user.password
        )

    cursor.execute(
        """
        UPDATE users
        SET username=%s,
            email=%s,
            password=%s,
            role=%s
        WHERE id=%s
        """,
        (
            username,
            email,
            password,
            role,
            id
        )
    )
    conn.commit()
    return {
        "message": "User updated successfully"
    }

@router.delete("/{id}")
def delete_user(id: int):
    cursor.execute(
        """
        SELECT * FROM users
        WHERE id=%s
        """,
        (id,)
    )
    user = cursor.fetchone()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    cursor.execute(
        """
        DELETE FROM users
        WHERE id=%s
        """,
        (id,)
    )
    conn.commit()
    return {
        "message": "User deleted successfully"
    }

