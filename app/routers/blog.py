from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException
)

import redis
import json
r = redis.Redis(host='localhost', port=6379, decode_responses=True)


from app.schemas.blog import (
    BlogCreate,
    BlogUpdate,
    
)
from app.websocket.manager import manager


from app.utils.deps import get_current_user,RoleChecker
from app.db.postgres import conn, cursor

import shutil
import os
import uuid

router = APIRouter(
    prefix="/blogs",
    tags=["Blogs"]
)

@router.post("/")
async def create_blog(
    blog: BlogCreate,
    current_user: dict = Depends(RoleChecker(["admin", "user"]))
):

    cursor.execute(
        """
        INSERT INTO blogs
        (title, content, category, author)
        VALUES (%s, %s, %s, %s)
        RETURNING *
        """,
        (
            blog.title,
            blog.content,
            blog.category,
            current_user["sub"] 
        )
    )


    conn.commit()
    created_blog = cursor.fetchone()

    
    await manager.broadcast_except_user(
        {
            "type": "NEW_BLOG",
            "title": blog.title,
            "author": current_user["sub"]
        },
        exclude_user=current_user["sub"]
    )
    return created_blog

@router.get("/")
def get_blogs():
    cached_blogs = r.get("blogs")

    if cached_blogs:
        print("Data From Redis")
        if isinstance(cached_blogs, bytes):
            cached_blogs = cached_blogs.decode("utf-8")
        return json.loads(cached_blogs)

    print("Data From Database")

    cursor.execute("SELECT id, title, content FROM blogs ORDER BY id DESC")
    rows = cursor.fetchall()

    blogs = []
    for row in rows:
        blogs.append({
            "id": row["id"],
            "title": row["title"],
            "content": row["content"]
        })

    r.setex("blogs", 60, json.dumps(blogs))
    return blogs

@router.put("/{id}")
def update_blog(
    id: int,
    blog: BlogUpdate,
    current_user: dict = Depends(RoleChecker(["admin", "editor", "user"]))
):
    cursor.execute(
        "SELECT * FROM blogs WHERE id=%s",
        (id,)
    )
    existing_blog = cursor.fetchone()
    if not existing_blog:
        raise HTTPException(
            status_code=404,
            detail="Blog not found"
        )
    
    if current_user["role"] == "user" and existing_blog["author"] != current_user["sub"]:
            raise HTTPException(
                status_code=403,
                detail="You can only edit your own blogs"
            )

    cursor.execute(
        """
        UPDATE blogs
        SET title=%s,
            content=%s,
            category=%s
        WHERE id=%s
        RETURNING *
        """,
        (
            blog.title,
            blog.content,
            blog.category,
            id
        )
    )
    conn.commit()
    updated_blog = cursor.fetchone()
    return updated_blog


@router.delete("/{id}")
def delete_blog(
    id: int,
    current_user: dict = Depends(RoleChecker(["admin", "user"]))
):

    cursor.execute(
        "SELECT * FROM blogs WHERE id=%s",
        (id,)
    )
    blog = cursor.fetchone()

    if not blog:
        raise HTTPException(
            status_code=404,
            detail="Blog not found"
        )
    
    print("TOKEN USERNAME IS:", current_user["sub"])
    print("DATABASE AUTHOR IS:", blog["author"])

    if current_user["role"] == "user" and blog["author"] != current_user["sub"]:
        raise HTTPException(
            status_code=403,
            detail="You can delete only your own blogs"
        )


    cursor.execute(
        "DELETE FROM blogs WHERE id=%s",
        (id,)
    )
    conn.commit()
    
    return {
        "message": "Blog deleted successfully"
    }


@router.get("/protected")
def protected_route(
    user: str = Depends(get_current_user)
):
    return {"msg": f"Hello {user}"}


@router.post("/{id}/upload-image")
def upload_image(
    id: int,
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):

    os.makedirs(
        "uploads/images",
        exist_ok=True
    )

    filename = f"{uuid.uuid4()}_{file.filename}"

    file_path = f"uploads/images/{filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    cursor.execute(
        """
        UPDATE blogs
        SET image=%s
        WHERE id=%s
        """,
        (file_path, id)
    )

    conn.commit()

    return {
        "message": "Image uploaded",
        "path": file_path
    }



@router.post("/{id}/upload-video")
def upload_video(
    id: int,
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):

    os.makedirs(
        "uploads/videos",
        exist_ok=True
    )

    filename = f"{uuid.uuid4()}_{file.filename}"

    file_path = f"uploads/videos/{filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    cursor.execute(
        """
        UPDATE blogs
        SET video=%s
        WHERE id=%s
        """,
        (file_path, id)
    )

    conn.commit()

    return {
        "message": "Video uploaded",
        "path": file_path
    }


from fastapi import APIRouter, WebSocket, WebSocketDisconnect

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user_id)