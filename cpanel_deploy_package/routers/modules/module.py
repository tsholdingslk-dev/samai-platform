from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from security import get_current_user

router = APIRouter(
    prefix="/modules",
    tags=["Modules"]
)

@router.post("/", response_model=schemas.ModuleResponse)
def create_module(
    module: schemas.ModuleCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    new_module = models.Module(
        project_id=module.project_id,
        module_type=module.module_type,
        config=module.config,
        enabled="true" if module.enabled else "false"
    )
    db.add(new_module)
    db.commit()
    db.refresh(new_module)
    return new_module

@router.get("/project/{project_id}", response_model=list[schemas.ModuleResponse])
def get_project_modules(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    modules = db.query(models.Module).filter(models.Module.project_id == project_id).all()
    return modules

@router.put("/{module_id}", response_model=schemas.ModuleResponse)
def update_module(
    module_id: str,
    module_update: schemas.ModuleCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    module = db.query(models.Module).filter(models.Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    module.module_type = module_update.module_type
    module.config = module_update.config
    module.enabled = "true" if module_update.enabled else "false"
    
    db.commit()
    db.refresh(module)
    return module

@router.delete("/{module_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_module(
    module_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    module = db.query(models.Module).filter(models.Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    db.delete(module)
    db.commit()
    return {"ok": True}
