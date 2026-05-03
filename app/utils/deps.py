from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from jose import jwt

auth_scheme = HTTPBearer()

SECRET_KEY = "secret123"
ALGORITHM = "HS256"


def get_current_user(token=Depends(auth_scheme)):
    try:
        token = token.credentials  # 🔥 IMPORTANT FIX

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")

        if not username:
            raise HTTPException(status_code=401, detail="In valid token")

        return username

    except Exception:
        raise HTTPException(status_code=401, detail="Token invalid or expired")