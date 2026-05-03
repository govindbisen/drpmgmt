from sqlalchemy.orm import Session
from app.models.blog import BlogDB
from app.schemas.blog import BlogCreate
from fastapi import HTTPException

def create_blog(db: Session, blog: BlogCreate, user):
    new_blog = BlogDB(
        title=blog.title,
        content=blog.content,
         owner_id=user.id  
    )
    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)
    return new_blog


def get_blogs(db: Session):
    return db.query(BlogDB).all()

def update_blog(db: Session, blog_id: int, blog):
    existing = db.query(BlogDB).filter(BlogDB.id == blog_id).first()

    if not existing:
        raise HTTPException(status_code=404, detail="Blog not found")

    existing.title = blog.title
    existing.content = blog.content

    db.commit()
    db.refresh(existing)

    return existing


def delete_blog(db: Session, blog_id: int):
    blog = db.query(BlogDB).filter(BlogDB.id == blog_id).first()

    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")

    db.delete(blog)
    db.commit()

    return {"message": "Blog deleted"}