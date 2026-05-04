from fastapi import FastAPI
from app.database import Base, engine

# models load karne ke liye
from app.models import blog as blog_model
from app.models import user

# routers
from app.routers import blog as blog_router
from app.routers import auth

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev ke liye
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# tables create
Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"msg": "Structured app running 🚀"}

# routers include
app.include_router(blog_router.router)
app.include_router(auth.router)