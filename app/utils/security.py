from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str):
    password = password.strip()[:72]   # safety fix
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    plain = plain.strip()[:72]
    return pwd_context.verify(plain, hashed)