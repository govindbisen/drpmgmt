from pydantic import BaseModel
from pydantic import field_validator

class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "user"
    # custom velidation and serialization rule .           
    @field_validator("password")
    def password_length(cls, value):
       if len(value) < 8:
           raise ValueError("Password must be at least 8 characters long")
       return value

   