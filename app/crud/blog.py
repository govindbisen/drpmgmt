from sqlalchemy.orm import Session
from app.models.blog import BlogDB
from app.schemas.blog import BlogCreate
from fastapi import HTTPException

from sqlalchemy import text
from fastapi import HTTPException

def create_blog(db, blog, username):
    result = db.execute(
        text("SELECT id FROM users WHERE username = :username"),
        {"username": username}
    ).fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="User not found")

    user_id = result[0]

    new_blog = BlogDB(
        title=blog.title,
        content=blog.content,
        owner_id=user_id   # ✅ correct
    )

    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)

    return new_blog



def get_blogs(db: Session):
    return db.query(BlogDB).all()

def update_blog(db: Session, blog_id: int, blog,username):
    user = _get_user_meta(db, username)
    existing = db.query(BlogDB).filter(BlogDB.id == blog_id).first()

    if not existing:
        raise HTTPException(status_code=404, detail="Blog not found")

     # 🔐 RBAC + ownership
    if user["role"] != "admin" and existing.owner_id != user["id"]:
        raise HTTPException(status_code=403, detail="Not your blog ❌")
    
    existing.title = blog.title
    existing.content = blog.content

    db.commit()
    db.refresh(existing)

    return existing


def delete_blog(db: Session, blog_id: int,username):
    user = _get_user_meta(db, username)

    blog = db.query(BlogDB).filter(BlogDB.id == blog_id).first()

    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")

     # 🔐 RBAC + ownership
    if user["role"] != "admin" and blog.owner_id != user["id"]:
        raise HTTPException(status_code=403, detail="Not your blog ❌")
    
    db.delete(blog)
    db.commit()

    return {"message": "Blog deleted"}


def _get_user_meta(db, username):
    row = db.execute(
        text("SELECT id, role FROM users WHERE username = :u"),
        {"u": username}
    ).fetchone()

    if not row:
        raise HTTPException(status_code=401, detail="User not found")

    return {"id": row[0], "role": row[1]}


def save_image_path(db, blog_id, file_path, username):
    user = _get_user_meta(db, username)

    blog = db.query(BlogDB).filter(BlogDB.id == blog_id).first()

    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")

    # 🔐 RBAC + ownership check
    if user["role"] != "admin" and blog.owner_id != user["id"]:
        raise HTTPException(status_code=403, detail="Not your blog ❌")

    blog.image_url = file_path
    db.commit()
    db.refresh(blog)

    return blog