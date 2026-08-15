import os
import sys
import asyncio

# 1. Add application directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))

# 2. Guarantee event loop exists for Phusion Passenger WSGI thread
try:
    asyncio.get_event_loop()
except RuntimeError:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

# 3. Import FastAPI backend app & a2wsgi WSGI adapter
from main import app as fastapi_app
from a2wsgi import ASGIMiddleware

# 4. Standard cPanel Passenger WSGI application object
application = ASGIMiddleware(fastapi_app)
