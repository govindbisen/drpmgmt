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
