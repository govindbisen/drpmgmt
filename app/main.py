from fastapi import FastAPI,Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse

from fastapi.templating import Jinja2Templates
templates = Jinja2Templates(directory="templates")

import os
os.makedirs("uploads/images", exist_ok=True)
os.makedirs("uploads/videos", exist_ok=True)

posts: list[dict] = [
    {
        "id": 1,
        "author": "Govind Bisen",
        "author_username": "govind.codes",
        "author_image": "profile_pics/default.jpg",
        "title": "A Peaceful Visit to ISKCON Temple Jabalpur",
        "slug": "peaceful-visit-iskcon-jabalpur",
        "content": "ISKCON Temple Jabalpur is one of the most peaceful spiritual destinations in the city. The temple atmosphere, devotional songs, evening aarti, and calm surroundings create a deeply spiritual experience for visitors and devotees.",
        "category": "Spirituality",
        "tags": ["Krishna", "Temple", "Jabalpur", "Meditation"],
        "date_posted": "May 20, 2025",
        "read_time": "4 min read",
        "views": 1240,
        "likes": 328,
        "comments": 42,
        "featured": True,
    },
    {
        "id": 2,
        "author": "Ankit Sharma",
        "author_username": "ankit.dev",
        "author_image": "profile_pics/default.jpg",
        "title": "Morning Aarti Experience at ISKCON Jabalpur",
        "slug": "morning-aarti-iskcon-jabalpur",
        "content": "The morning aarti at ISKCON Jabalpur fills the temple with positive spiritual energy. Devotees gather early in the morning to chant bhajans, offer prayers, and begin their day peacefully.",
        "category": "Culture",
        "tags": ["Aarti", "Devotion", "Morning", "Temple"],
        "date_posted": "May 21, 2025",
        "read_time": "3 min read",
        "views": 980,
        "likes": 210,
        "comments": 21,
        "featured": False,
    },
    {
        "id": 3,
        "author": "Riya Verma",
        "author_username": "riyawrites",
        "author_image": "profile_pics/default.jpg",
        "title": "Why ISKCON Jabalpur is Loved by Devotees",
        "slug": "why-iskcon-jabalpur-loved",
        "content": "ISKCON Jabalpur is known for its devotional environment, clean temple premises, spiritual teachings, and community programs. The temple welcomes everyone seeking peace and positivity.",
        "category": "Travel",
        "tags": ["ISKCON", "Spiritual", "Bhagavad Gita"],
        "date_posted": "May 22, 2025",
        "read_time": "5 min read",
        "views": 1750,
        "likes": 500,
        "comments": 67,
        "featured": True,
    },
    {
        "id": 4,
        "author": "Rahul Mishra",
        "author_username": "rahul.explore",
        "author_image": "profile_pics/default.jpg",
        "title": "Spiritual Peace Near Lametaghat Road",
        "slug": "spiritual-peace-lametaghat-road",
        "content": "Located near Lametaghat Road, ISKCON Temple offers a peaceful environment away from city noise. Many visitors come here for meditation, relaxation, and spiritual connection.",
        "category": "Lifestyle",
        "tags": ["Peace", "Meditation", "Nature"],
        "date_posted": "May 23, 2025",
        "read_time": "4 min read",
        "views": 860,
        "likes": 154,
        "comments": 18,
        "featured": False,
    },
    {
        "id": 5,
        "author": "Sneha Patel",
        "author_username": "sneha.blogs",
        "author_image": "profile_pics/default.jpg",
        "title": "Teachings of Bhagavad Gita at ISKCON Jabalpur",
        "slug": "teachings-bhagavad-gita-iskcon",
        "content": "ISKCON Jabalpur regularly conducts Bhagavad Gita sessions where devotees learn about discipline, spirituality, devotion, and practical life lessons from Lord Krishna's teachings.",
        "category": "Education",
        "tags": ["Bhagavad Gita", "Knowledge", "Krishna"],
        "date_posted": "May 24, 2025",
        "read_time": "6 min read",
        "views": 2140,
        "likes": 642,
        "comments": 93,
        "featured": True,
    },
]

# routers
from app.routers import blog as blog_router
from app.routers import auth

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def home():
    return {"msg": "Structured app running 🚀"}

@app.get("/posts", response_class=HTMLResponse, include_in_schema=False)
def home():
    return f"<h1>{posts[0]['title']}</h1>"

@app.get("/api/posts/template", response_class=HTMLResponse, include_in_schema=False)
def home(request: Request):
    return templates.TemplateResponse(
        request,
        "home.html",
        {"posts": posts, "title": "Home"},
    )

@app.get("/api/posts")
def get_posts():
    return posts


from fastapi.middleware.cors import CORSMiddleware
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev ke liye
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# tables create
# Base.metadata.create_all(bind=engine)



# routers include
app.include_router(blog_router.router)
app.include_router(auth.router)