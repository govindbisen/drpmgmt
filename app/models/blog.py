# app/models/blog.py

from sqlalchemy import Column, Integer, String,ForeignKey
from app.database import Base  

class BlogDB(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    image_url = Column(String, nullable=True)
  
