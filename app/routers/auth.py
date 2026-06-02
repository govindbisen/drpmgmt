# Access token (short-lived) 15 mint
# Refresh token (long-lived) 7 days - 30 days 
# HttpOnly secure cookies (not localStorage)
# token rotation + DB storage for refresh tokens

from fastapi import APIRouter, HTTPException,Response,Request
from app.schemas.user import UserCreate,LoginUser
from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES,REFRESH_TOKEN_EXPIRE_DAYS,REFRESH_TOKEN_EXPIRE_SECONDS,ACCESS_TOKEN_EXPIRE_SECONDS

from app.utils.security import (
    verify_password,
    hash_password
)
from app.utils.token import create_access_token,create_refresh_token,decode_token
from app.db.postgres import conn, cursor
from app.utils.response import success_response,error_response
from fastapi import APIRouter, HTTPException, Response
import traceback

router = APIRouter(prefix="/auth")

from datetime import datetime, timedelta, timezone

@router.post("/signup")
def signup(user: UserCreate):
    try: 
        # print(user)
        cursor.execute(
            "SELECT * FROM users WHERE username=%s",
            (user.username,)
        )

        existing_user = cursor.fetchone()
        # print(existing_user)

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Username already exists"
            )

        hashed_password = hash_password(user.password)

        # insert user
        cursor.execute(
            """
            INSERT INTO users(username, password,email, role)
            VALUES(%s, %s, %s,%s)
            """,
            (user.username, hashed_password, user.email,"user")
        )
        conn.commit()

    except Exception as e:
            conn.rollback()
            return error_response(
                message="Internal server error",
                error=e,
                status_code=500
            )
    return success_response(
            message="User created successfully",
            data={
                "username": user.username,
                "email": user.email
            }
        )

@router.post("/login")
def login(user: LoginUser, response: Response):
    try:
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
        payload = {
            "sub": db_user["username"],
            "role": db_user["role"]
        }
        access_token = create_access_token(payload)
        refresh_token = create_refresh_token(payload)
        cursor.execute(
            "UPDATE users SET refresh_token=%s WHERE username=%s",
            (refresh_token, db_user["username"])
        )
        conn.commit()
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            max_age=ACCESS_TOKEN_EXPIRE_SECONDS,
            samesite="lax"
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            max_age=REFRESH_TOKEN_EXPIRE_SECONDS,
            samesite="lax"
        )
        return {
            "message": "Login successful!"
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        # print("ERROR:", str(e))
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@router.post("/refresh")
def refresh_token(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        username = payload["sub"]
        cursor.execute(
            "SELECT refresh_token, role FROM users WHERE username=%s",
            (username,)
        )
        user = cursor.fetchone()
        if not user or user["refresh_token"] != refresh_token:
            raise HTTPException(status_code=401, detail="Token revoked")
        new_access = create_access_token({
            "sub": username,
            "role": user["role"]
        })
        new_refresh = create_refresh_token({
            "sub": username,
            "role": user["role"]
        })
        cursor.execute(
            "UPDATE users SET refresh_token=%s WHERE username=%s",
            (new_refresh, username)
        )
        conn.commit()
        response.set_cookie(
            key="access_token",
            value=new_access,
            httponly=True,
            max_age=ACCESS_TOKEN_EXPIRE_SECONDS,
            samesite="lax",
            path="/"
        )

        response.set_cookie(
        key="refresh_token",
        value=new_refresh,
        httponly=True,
        max_age=REFRESH_TOKEN_EXPIRE_SECONDS,
        samesite="lax",
        path="/"
)
        return {"message": "Token refreshed"}
    except:
        raise HTTPException(status_code=401, detail="Invalid refresh token")   

@router.post("/logout")
def logout(response: Response):
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return {"message": "Logged out"}

@router.get("/me")
def get_current_user(request: Request):
    try:
        # print("COOKIES:", request.cookies)
        # print("HEADERS:", request.headers)
        access_token = request.cookies.get("access_token")
        # print("ACCESS TOKEN:" , access_token )
        if not access_token:
            raise HTTPException(
                status_code=401,
                detail="Not authenticated"
            )
        
        payload = decode_token(access_token)
        if not payload:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )
        username = payload.get("sub")
        role = payload.get("role")

        if not username:
            raise HTTPException(
                status_code=401,
                detail="Token missing user info"
            )
        cursor.execute(
            "SELECT username, email, role FROM users WHERE username=%s",
            (username,)
        )
        user = cursor.fetchone()
        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        return success_response(
            data={
                "username": user["username"],
                "email": user["email"],
                "role": user["role"]
            },
            message="Current user fetched successfully"
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        # print("ME ERROR:", str(e))
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )