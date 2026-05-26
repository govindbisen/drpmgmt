from pydantic import BaseModel # to validate request
from pydantic import field_validator # decorator to validate field
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    admin = "admin"
    user = "user"
    author = "author"
    editor = "editor"


# to validate data coming from frontend
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: UserRole = UserRole.user

    @field_validator("role")
    def validate_role(cls, value):
        value = value.lower()
        allowed_roles = [
            "user",
            "admin"
        ]
        if value not in allowed_roles:
            raise ValueError(
                "Role must be either user or admin"
            )
        return value

    @field_validator("email")
    def validate_email(cls, value):
        value = value.strip()
        if "@" not in value:
            raise ValueError(
                "Email must contain @"
            )

        if "." not in value:
            raise ValueError(
                "Email must contain ."
            )

        return value.lower()


    @field_validator("password")
    def password_length(cls, value):
        if len(value) < 8:
            raise ValueError(
                "Password must be at least 8 characters long"
            )
        return value
    

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
   
    @field_validator("role")
    def validate_role(cls, value):
        if value is None:
            return value
        value = value.lower()
        allowed_roles = [
            "user",
            "admin"
        ]
        if value not in allowed_roles:
            raise ValueError(
                "Role must be either user or admin"
            )
        return value
    
    @field_validator("email")
    def validate_email(cls, value):
        if value is None:
            return value
        value = value.strip()
        if "@" not in value:
            raise ValueError(
                "Email must contain @"
            )
        if "." not in value:
            raise ValueError(
                "Email must contain ."
            )
        return value.lower()

    @field_validator("password")
    def password_length(cls, value):
        if value is None:
            return value
        if len(value) < 8:
            raise ValueError(
                "Password must be at least 8 characters long"
            )
        return value