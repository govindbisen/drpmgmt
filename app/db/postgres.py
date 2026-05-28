import psycopg2
from psycopg2.extras import RealDictCursor
from app.core.config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

conn = psycopg2.connect(
    host=DB_HOST,
    port=DB_PORT,
    database=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD
)

# cursor = conn.cursor()
cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

