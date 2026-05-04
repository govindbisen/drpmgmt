from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.blog import BlogCreate, BlogUpdate
from app.crud.blog import create_blog, get_blogs, update_blog, delete_blog
from app.utils.deps import get_current_user
from app.crud.blog import save_image_path

import shutil
import os
import uuid

from app.utils.s3 import generate_presigned_upload_url, get_file_url

router = APIRouter()   # ✅ ONLY ONCE

# 🔥 CREATE
@router.post("/blogs")
def create(
    blog: BlogCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return create_blog(db, blog, user)


# 🔥 READ
@router.get("/blogs")
def read(db: Session = Depends(get_db)):
    return get_blogs(db)


# 🔥 UPDATE
@router.put("/blogs/{id}")
def update(
    id: int,
    blog: BlogUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return update_blog(db, id, blog, user)


# 🔥 DELETE
@router.delete("/blogs/{id}")
def delete(
    id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return delete_blog(db, id, user)


# 🔐 PROTECTED
@router.get("/protected")
def protected_route(user: str = Depends(get_current_user)):
    return {"msg": f"Hello {user}"}


# 📁 LOCAL IMAGE UPLOAD
@router.post("/blogs/{id}/upload-image")
def upload_image(
    id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    os.makedirs("uploads/images", exist_ok=True)

    # 🔥 unique filename
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = f"uploads/images/{filename}"

    # save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 🔥 DB + RBAC update
    return save_image_path(db, id, file_path, user)
# 🎥 VIDEO
@router.post("/blogs/{id}/upload-video")
def upload_video(
    id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    os.makedirs("uploads/videos", exist_ok=True)

    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = f"uploads/videos/{filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return save_image_path(db, id, file_path, user)


# ☁️ S3 PRESIGNED URL
@router.post("/blogs/upload-url")
def get_upload_url(content_type: str):
    filename = str(uuid.uuid4())

    url = generate_presigned_upload_url(filename, content_type)

    return {
        "upload_url": url,
        "file_key": filename,
        "file_url": get_file_url(filename)
    }