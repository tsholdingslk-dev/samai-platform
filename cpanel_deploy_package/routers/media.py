from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from security import get_current_user
from api_hub import api_hub
import asyncio
import concurrent.futures

router = APIRouter(
    prefix="/media",
    tags=["Media & Content"]
)

def run_async(coro):
    """Helper to run async code in sync context"""
    loop = asyncio.get_event_loop()
    if loop.is_running():
        with concurrent.futures.ThreadPoolExecutor() as pool:
            return pool.submit(lambda: asyncio.run(coro)).result()
    else:
        return loop.run_until_complete(coro)

@router.post("/social-prompt")
async def generate_social_prompt(
    platform: str = Form(...),  # facebook, instagram, youtube, twitter
    content_type: str = Form("post"),  # post, reel, story, thumbnail
    topic: str = Form(...),
    tone: str = Form("professional"),
    project_id: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Generate social media content prompts and captions"""
    if project_id:
        project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == current_user["user_id"]).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found or access denied")
    
    platform_guides = {
        "facebook": "Facebook posts perform best with engaging questions, clear CTAs, and 40-80 characters for optimal reach.",
        "instagram": "Instagram captions work well with line breaks, relevant hashtags, and authentic storytelling.",
        "youtube": "YouTube titles should be under 60 chars, include keywords, and create curiosity. Descriptions should be detailed with timestamps.",
        "twitter": "Twitter/X posts should be concise, use threads for longer content, and include relevant hashtags."
    }
    
    guide = platform_guides.get(platform.lower(), "Create engaging content that resonates with your audience.")
    
    prompt = f"""Generate a {content_type} for {platform} about: {topic}
Tone: {tone}

Platform guide: {guide}

Provide:
1. Main content/caption
2. Hashtags (if applicable)
3. Best posting time recommendation
4. Engagement tips"""
    
    messages = [
        {"role": "system", "content": "You are a social media expert. Create viral-worthy content."},
        {"role": "user", "content": prompt}
    ]
    
    try:
        result = await api_hub.chat(messages)
        return {
            "content": result["content"],
            "platform": platform,
            "content_type": content_type,
            "topic": topic,
            "provider": result.get("provider", "unknown")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Social prompt generation failed: {str(e)}")

@router.post("/image-prompt")
async def generate_image_prompt(
    description: str = Form(...),
    style: str = Form("photorealistic"),
    project_id: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Generate optimized prompts for image generation models"""
    if project_id:
        project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == current_user["user_id"]).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found or access denied")
    
    prompt = f"""Create a detailed image generation prompt for: {description}
Style: {style}

Include:
1. Main subject description
2. Lighting and atmosphere
3. Camera angle and composition
4. Color palette
5. Style details
6. Technical parameters (if applicable)

Make it detailed enough for AI image generators like Midjourney, DALL-E, or Stable Diffusion."""
    
    messages = [
        {"role": "system", "content": "You are an AI image prompt engineer. Create detailed, effective prompts."},
        {"role": "user", "content": prompt}
    ]
    
    try:
        result = await api_hub.chat(messages)
        return {
            "prompt": result["content"],
            "style": style,
            "provider": result.get("provider", "unknown")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image prompt generation failed: {str(e)}")

@router.post("/video-prompt")
async def generate_video_prompt(
    description: str = Form(...),
    duration: str = Form("30s"),
    style: str = Form("cinematic"),
    project_id: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Generate optimized prompts for video generation models"""
    if project_id:
        project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == current_user["user_id"]).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found or access denied")
    
    prompt = f"""Create a detailed video generation prompt for: {description}
Duration: {duration}
Style: {style}

Include:
1. Scene description
2. Camera movements
3. Lighting and mood
4. Audio/sound description
5. Transition ideas
6. Technical specifications

Make it suitable for AI video generators."""
    
    messages = [
        {"role": "system", "content": "You are a video production expert. Create detailed video prompts."},
        {"role": "user", "content": prompt}
    ]
    
    try:
        result = await api_hub.chat(messages)
        return {
            "prompt": result["content"],
            "duration": duration,
            "style": style,
            "provider": result.get("provider", "unknown")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video prompt generation failed: {str(e)}")

@router.post("/resize-guide")
async def get_resize_guide(
    original_format: str = Form("16:9"),
    target_format: str = Form("9:16"),
    platform: str = Form("youtube"),
    project_id: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get guide for resizing media to different aspect ratios"""
    if project_id:
        project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == current_user["user_id"]).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found or access denied")
    
    prompt = f"""Provide a guide for resizing media from {original_format} to {target_format} for {platform}.

Include:
1. Best practices for the conversion
2. What content to crop/keep
3. Recommended tools
4. Quality preservation tips
5. Platform-specific requirements"""
    
    messages = [
        {"role": "system", "content": "You are a media editing expert. Provide practical resizing guides."},
        {"role": "user", "content": prompt}
    ]
    
    try:
        result = await api_hub.chat(messages)
        return {
            "guide": result["content"],
            "original_format": original_format,
            "target_format": target_format,
            "platform": platform,
            "provider": result.get("provider", "unknown")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resize guide failed: {str(e)}")
