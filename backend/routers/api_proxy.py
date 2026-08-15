from fastapi import APIRouter, Request, HTTPException
from api_hub import api_hub

router = APIRouter(
    prefix="/v1",
    tags=["OpenAI Compatible Proxy"]
)

@router.post("/chat/completions")
async def chat_completions(request: Request):
    """
    OpenAI-compatible proxy endpoint.
    This allows external projects to use SAM AI as their primary API hub.
    """
    try:
        body = await request.json()
        messages = body.get("messages", [])
        model = body.get("model")
        
        # Extract additional parameters
        kwargs = {}
        if "temperature" in body:
            kwargs["temperature"] = body["temperature"]
        if "response_format" in body:
            kwargs["response_format"] = body["response_format"]
        if "max_tokens" in body:
            kwargs["max_tokens"] = body["max_tokens"]
            
        result = await api_hub.chat(messages=messages, model_override=model, **kwargs)
        
        return {
            "id": "chatcmpl-samai-proxy",
            "object": "chat.completion",
            "created": 1677652288,
            "model": result["model"],
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": result["content"],
                },
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": 0,
                "completion_tokens": 0,
                "total_tokens": 0
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
