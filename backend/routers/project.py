from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from security import get_current_user

router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)

DEFAULT_MODULES = ["pdf-translate", "coding", "voice", "media", "image"]

@router.post("/", response_model=schemas.ProjectResponse)
def create_project(
    project_input: schemas.ProjectCreate, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):
    new_project = models.Project(
        title=project_input.title,
        user_id=current_user["user_id"],
        type=project_input.type or "general"
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    # Create default modules for the project
    for module_type in DEFAULT_MODULES:
        new_module = models.Module(
            project_id=new_project.id,
            module_type=module_type,
            config="{}",
            enabled="true"
        )
        db.add(new_module)
    
    db.commit()
    
    return new_project

@router.get("/", response_model=list[schemas.ProjectResponse])
def get_projects(
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):
    projects = db.query(models.Project).filter(models.Project.user_id == current_user["user_id"]).order_by(models.Project.created_at.desc()).all()
    return projects

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: str, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):
    project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == current_user["user_id"]).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    db.delete(project)
    db.commit()
    return {"ok": True}
