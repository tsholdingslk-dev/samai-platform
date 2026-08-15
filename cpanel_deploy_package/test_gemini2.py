import asyncio
from api_hub import api_hub

async def test():
    messages = [
        {"role": "user", "content": "Hello!"}
    ]
    try:
        res = await api_hub.chat(messages)
        print("Success:", res)
    except Exception as e:
        print("Error:", e)

asyncio.run(test())
