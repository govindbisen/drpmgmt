import psycopg2
from psycopg2.extras import RealDictCursor

conn = psycopg2.connect(
    host="localhost",
    database="blogdb",
    user="postgres",
    password="Kudos@098",
    cursor_factory=RealDictCursor
)
cursor = conn.cursor()