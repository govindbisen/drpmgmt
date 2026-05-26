from pydantic import BaseModel
from typing import Optional

class BlogCreate(BaseModel):
    title: str
    content: str
    category: Optional[str] = None

class BlogUpdate(BaseModel):  
    title: str
    content: str
    category: Optional[str] = None