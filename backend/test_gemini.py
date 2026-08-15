import asyncio
from api_hub import api_hub
import base64

async def test():
    # create a dummy small image 1x1 pixel base64
    img_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
    messages = [
        {"role": "user", "content": [
            {"type": "text", "text": "What is this?"},
            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img_b64}"}}
        ]}
    ]
    try:
        res = await api_hub.chat(messages)
        print("Success:", res)
    except Exception as e:
        print("Error:", e)

asyncio.run(test())
