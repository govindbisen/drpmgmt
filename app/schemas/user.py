from pydantic import BaseModel
from pydantic import field_validator

class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "user"
                                    #custom validators and serialization rules
                                    # Developers can also create custom response serialization by modifying output data before returning it from endpoints.
                                            # Custom validation is useful when:
                                            # Business rules require complex validation logic
                                            # Input data must be transformed before processing
                                            # Security checks must be enforced
    @field_validator("password")
    def password_length(cls, value):
       if len(value) < 8:
           raise ValueError("Password must be at least 8 characters long")
       return value

   