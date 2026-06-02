# get_current_user()
from fastapi import Request, HTTPException
from fastapi import Depends
from fastapi.security import HTTPBearer
from jose import jwt

# auth_scheme = HTTPBearer()

SECRET_KEY = "secret123"
ALGORITHM = "HS256"

from app.utils.token import decode_token

def get_current_user(request: Request):

    access_token = request.cookies.get("access_token")

    print("COOKIE TOKEN:", access_token)

    if not access_token:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    try:
        payload = decode_token(access_token)
        return payload

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Token invalid or expired"
        )
    

class RoleChecker:
        def __init__(self, allowed_roles: list[str]):
            self.allowed_roles = allowed_roles

        def __call__(self, current_user: dict = Depends(get_current_user)) -> dict:
            user_role = current_user.get("role")
        
            if user_role not in self.allowed_roles:
                raise HTTPException(
                    status_code=403,
                    detail="You do not have permission to access this resource"
                )
                
            return current_user
