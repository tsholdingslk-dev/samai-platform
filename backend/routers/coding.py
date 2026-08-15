from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from security import get_current_user
from api_hub import api_hub
import asyncio
import concurrent.futures

router = APIRouter(
    prefix="/coding",
    tags=["Coding Module"]
)

def run_async(coro):
    """Helper to run async code in sync context"""
    loop = asyncio.get_event_loop()
    if loop.is_running():
        with concurrent.futures.ThreadPoolExecutor() as pool:
            return pool.submit(lambda: asyncio.run(coro)).result()
    else:
        return loop.run_until_complete(coro)

@router.post("/generate")
async def generate_code(
    prompt: str = Form(...),
    language: str = Form("javascript"),
    framework: Optional[str] = Form(None),
    project_id: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Generate code based on description"""
    if project_id:
        project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == current_user["user_id"]).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found or access denied")
    
    context = ""
    if framework:
        context = f" using {framework} framework"
    
    system_prompt = f"""You are an expert {language} developer{context}.
Generate clean, well-documented, production-ready code.
Include comments explaining key parts.
Follow best practices and modern patterns.
Return only the code with minimal explanation unless asked."""
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt}
    ]
    
    try:
        result = await api_hub.chat(messages)
        return {
            "code": result["content"],
            "language": language,
            "framework": framework,
            "provider": result.get("provider", "unknown")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code generation failed: {str(e)}")

@router.post("/explain")
async def explain_code(
    code: str = Form(...),
    language: str = Form("javascript"),
    project_id: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Explain what a piece of code does"""
    if project_id:
        project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == current_user["user_id"]).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found or access denied")
    
    prompt = f"""Explain the following {language} code in detail.
Break down what each part does.
Point out any potential issues or improvements.

Code:
```{language}
{code}
```"""
    
    messages = [
        {"role": "system", "content": "You are a code instructor. Explain code clearly and concisely."},
        {"role": "user", "content": prompt}
    ]
    
    try:
        result = await api_hub.chat(messages)
        return {
            "explanation": result["content"],
            "language": language,
            "provider": result.get("provider", "unknown")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code explanation failed: {str(e)}")

@router.post("/fix")
async def fix_code(
    code: str = Form(...),
    error: Optional[str] = Form(None),
    language: str = Form("javascript"),
    project_id: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Fix bugs or errors in code"""
    if project_id:
        project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == current_user["user_id"]).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found or access denied")
    
    error_context = f"\n\nError message:\n{error}" if error else ""
    
    prompt = f"""Fix the following {language} code and explain what was wrong.
Provide the corrected code and a brief explanation of the fix.{error_context}

Code:
```{language}
{code}
```"""
    
    messages = [
        {"role": "system", "content": "You are a debugging expert. Fix code and explain the solution clearly."},
        {"role": "user", "content": prompt}
    ]
    
    try:
        result = await api_hub.chat(messages)
        return {
            "fixed_code": result["content"],
            "language": language,
            "provider": result.get("provider", "unknown")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code fix failed: {str(e)}")

@router.post("/api-connect")
async def api_connect_help(
    description: str = Form(...),
    language: str = Form("javascript"),
    project_id: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Help connect to an API or set up API integration"""
    if project_id:
        project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == current_user["user_id"]).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found or access denied")
    
    prompt = f"""Help me connect to an API using {language}.
Provide complete working code examples including:
1. API client setup
2. Making requests
3. Handling responses
4. Error handling
5. Environment variables for API keys

Description of what I need:
{description}"""
    
    messages = [
        {"role": "system", "content": "You are an API integration expert. Provide complete, working code examples."},
        {"role": "user", "content": prompt}
    ]
    
    try:
        result = await api_hub.chat(messages)
        return {
            "guide": result["content"],
            "language": language,
            "provider": result.get("provider", "unknown")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"API connect help failed: {str(e)}")

@router.post("/deploy")
async def deploy_guide(
    project_type: str = Form(...),  # react, php, python, etc.
    platform: str = Form("local"),
    project_id: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get deployment guide for a project"""
    if project_id:
        project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == current_user["user_id"]).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found or access denied")
    
    prompt = f"""Provide a step-by-step deployment guide for a {project_type} project to {platform}.
Include:
1. Prerequisites
2. Build steps
3. Configuration
4. Deployment commands
5. Common issues and fixes"""
    
    messages = [
        {"role": "system", "content": "You are a DevOps expert. Provide clear, actionable deployment guides."},
        {"role": "user", "content": prompt}
    ]
    
    try:
        result = await api_hub.chat(messages)
        return {
            "guide": result["content"],
            "project_type": project_type,
            "platform": platform,
            "provider": result.get("provider", "unknown")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deploy guide failed: {str(e)}")
