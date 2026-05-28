# ================================

# CREATE VIRTUAL ENVIRONMENT

# ================================

python -m venv .venv

# ACTIVATE VENV (GIT BASH)

# ================================

source .venv/Scripts/activate
pip install python-dotenv

# POSTGRESQL

pip install psycopg2-binary

# JWT AUTH + PASSWORD HASHING

pip install python-jose
pip install passlib[bcrypt]

# JINJA TEMPLATES

pip install jinja2

# FILE UPLOADS / FORM DATA

pip install python-multipart

# OPTIONAL BUT IMPORTANT

pip install email-validator
pip install requests
pip install pillow

# ORM + MIGRATION

pip install sqlalchemy
pip install alembic
pip install asyncpg

# ================================

# DEVELOPMENT TOOLS

pip install black
pip install isort
pip install flake8

# ================================

pip install fastapi uvicorn python-dotenv psycopg2-binary python-jose passlib[bcrypt] jinja2 python-multipart email-validator requests pillow

# ================================

# RUN SERVER

# ================================

uvicorn app.main:app --reload

# ================================

# GENERATE requirements.txt

# ================================

pip freeze > requirements.txt

# ================================

# INSTALL FROM requirements.txt

pip install -r requirements.txt

# =================================

# =================================

## NEXT ---

Protected routes in React (PrivateRoute)
Role-based UI (admin/user dashboard)
Axios global error handler system
“Stay logged in” vs “remember me” system
Complete MERN production auth architecture

# =================================

signup
login
logout
refresh-token
forgot-password
reset-password
verify-email
change-password
oauth google se login
token blacklist
refresh token rotation
device tracking

admin-only routes
editor routes
user permissions
roles
ownership checks

search blogs
filter by category
sort by latest
sort by views

GET /blogs?category=spiritual
GET /blogs?sort=latest

limit
offset
page
cursor pagination
GET /blogs?page=2&limit=10

image upload
video upload
pdf upload
s3 upload
presigned urls

image upload
video upload
pdf upload
s3 upload
presigned urls

views count
read time
trending blogs
most liked blogs
engagement metrics

email notifications
push notifications
real-time websocket notifications

send email
video processing
thumbnail generation
scheduled jobs

# Security

jwt
Auto logout
cookies
csrf
rate limiting
ip blocking
csp
helmet-like headers
email verification
2FA

# Caching

redis cache
response caching
query caching
session storage

# logging

websocket chat
live notifications
live comments
online users

# Admin op

ban user
feature blog
approve blog
soft delete
restore deleted data

# Data management

soft delete
archive
draft
publish/unpublish
version history

# Third party integration

razorpay
stripe
aws s3
google auth
github auth
firebase
cloudinary

# devops related

docker
nginx
gunicorn
ci/cd
kubernetes
load balancing

# Advanced DB

transactions
joins
indexes
query optimization
replication
sharding
connection pooling

# Real blog system operation

draft blogs
scheduled publishing
rich text editor
tags
categories
slug urls
seo metadata
featured image
comments
nested comments
likes
bookmarks
author profiles
analytics
admin moderation

pending
approved
rejected

pending
approved
rejected
