Python has support for optional "type hints" (also called "type annotations").
typing module from typing import Any

Pydantic is a Python library to perform data validation.
You declare the "shape" of the data as classes with attributes.And each attribute has a type.

from datetime import datetime
from pydantic import BaseModel
class User(BaseModel):
id: int
name: str = "John Doe"
signup_ts: datetime | None = None
friends: list[int] = []

external_data = {
"id": "123",
"signup_ts": "2017-06-01 12:22",
"friends": [1, "2", b"3"],
}
user = User(\*\*external_data)
print(user)

from typing import Annotated
Python itself doesn't do anything with this Annotated. And for editors and other tools, the type is still str.
But you can use this space in Annotated to provide FastAPI with additional metadata about how you want your application to behave.
def say_hello(name: Annotated[str, "this is just metadata"]) -> str:
return f"Hello {name}"

=======
path operation function-
@app.get('/')
async def read_results():
results = await some_library()
return results

"coroutines", with async and await syntax.

Let's see that phrase by parts in the sections below:

Asynchronous Code
async and await
Coroutines

parallelism vs concurrency

And as most of the execution time is taken by actual work (instead of waiting), and the work in a computer is done by a CPU, they call these problems "CPU bound".
Audio or image processing.
Computer vision
Machine Learning
Deep Learning

With FastAPI you can take advantage of concurrency that is very common for web development (the same main attraction of NodeJS).
But you can also exploit the benefits of parallelism and multiprocessing (having multiple processes running in parallel) for CPU bound workloads like those in Machine Learning systems.

Starlette (and FastAPI) are based on AnyIO, which makes it compatible with both Python's standard library asyncio and Trio.

Coroutine is just the very fancy term for the thing returned by an async def function. Python knows that it is something like a function, that it can start and that it will end at some point, but that it might be paused ⏸ internally too, whenever there is an await inside of i

but t all this functionality of using asynchronous code with async and await is many times summarized as using "coroutines"

An environment variable (also known as "env var") is a variable that lives outside of the Python code, in the operating system,
export MY_NAME="Wade Wilson"
echo "Hello $MY_NAME"
$Env:MY_NAME = "Wade Wilson"
echo "Hello $Env:MY_NAME"

=== read env variable
import os
name = os.getenv("MY_NAME", "World")
print(f"Hello {name} from Python")

---

path env

---

virtual env
When you work in Python projects you probably should use a virtual environment (or a similar mechanism) to isolate the packages you install for each project.

===
A virtual environment is a directory with some files in it.

python -m venv .venv
-m tells Python: “run a module as a script”
venv is the built-in module that creates virtual environments
===
activate --- source .venv/Scripts/activate
deactivate --- deactivate
===
Get-Command python
python -m pip install --upgrade pip
python -m ensurepip --upgrade
.gitignore
echo "\*" > .venv/.gitignore
===
pip install "fastapi[standard]"
If you have a requirements.txt, you can now use it to install its packages.
pip install -r requirements.txt
python main.py

once you are done with working the project deactivate
uv can do a lot of things, it can:Install Python for you, including different versions Manage the virtual environment for your projects
Install packages

pip install "fastapi[standard]"
pip install fastapi uvicorn

http://127.0.0.1:8000/docs

===
FastAPI generates a "schema" with all your API using the OpenAPI standard for defining APIs.
"Schema"¶

====
start ===
fastapi dev
uvicorn main:app --reload --reload-dir . --reload-exclude .venv

===
You can also use the other operations:

@app.post()
@app.put()
@app.delete()
And the more exotic ones:

@app.options()
@app.head()
@app.patch()
@app.trace()

Import FastAPI.
Create an app instance.
Write a path operation decorator using decorators like @app.get("/").
Define a path operation function; for example, def root(): ....
Run the development server using the command fastapi dev.
Optionally deploy your app with fastapi deploy. https://fastapicloud.com/
