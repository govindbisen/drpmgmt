from fastapi import APIRouter
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.blog import BlogCreate
from app.crud.blog import create_blog, get_blogs
from app.schemas.blog import BlogUpdate
from app.crud.blog import update_blog, delete_blog
from app.utils.deps import get_current_user
from fastapi import Depends

router = APIRouter()

@router.post("/blogs")
def create(blog: BlogCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)):
    return create_blog(db, blog, user) 


@router.get("/blogs")
def read(db: Session = Depends(get_db)):
    return get_blogs(db)

# @router.put("/blogs/{blog_id}")
# def update(blog_id: int, blog: BlogUpdate, db: Session = Depends(get_db)):
#     return update_blog(db, blog_id, blog)

# @router.delete("/blogs/{blog_id}")
# def delete(blog_id: int, db: Session = Depends(get_db)):
#     return delete_blog(db, blog_id)

@router.put("/blogs/{id}")
def update(id: int, blog: BlogUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return update_blog(db, id, blog, user)


@router.delete("/blogs/{id}")
def delete(id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return delete_blog(db, id, user)

@router.get("/protected")
def protected_route(user: str = Depends(get_current_user)):
    return {"msg": f"Hello {user}, you are authenticated 🔐"}
