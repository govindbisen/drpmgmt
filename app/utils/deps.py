# get_current_user()
from fastapi import Request, HTTPException
from fastapi import Depends
from fastapi.security import HTTPBearer
from jose import jwt

# auth_scheme = HTTPBearer()

SECRET_KEY = "secret123"
ALGORITHM = "HS256"


# def get_current_user(token=Depends(auth_scheme)):
#     try:
#         token = token.credentials 
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username = payload.get("sub")
        
#         if not username:
#             raise HTTPException(status_code=401, detail="In valid token")
#         return username
    
#     except Exception:
#         raise HTTPException(status_code=401, detail="Token invalid or expired")


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