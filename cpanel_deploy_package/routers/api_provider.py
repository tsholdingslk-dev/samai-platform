from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from security import get_current_user

router = APIRouter(
    prefix="/api-providers",
    tags=["API Hub"]
)

@router.post("/", response_model=schemas.APIProviderResponse)
def create_provider(
    provider: schemas.APIProviderCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    new_provider = models.APIProvider(
        name=provider.name,
        api_key=provider.api_key,
        base_url=provider.base_url,
        model=provider.model,
        priority=str(provider.priority),
        quota_limit=str(provider.quota_limit)
    )
    db.add(new_provider)
    db.commit()
    db.refresh(new_provider)
    return new_provider

@router.get("/", response_model=list[schemas.APIProviderResponse])
def get_providers(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    providers = db.query(models.APIProvider).all()
    return providers

@router.put("/{provider_id}", response_model=schemas.APIProviderResponse)
def update_provider(
    provider_id: str,
    provider_update: schemas.APIProviderCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    provider = db.query(models.APIProvider).filter(models.APIProvider.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    provider.name = provider_update.name
    provider.api_key = provider_update.api_key
    provider.base_url = provider_update.base_url
    provider.model = provider_update.model
    provider.priority = str(provider_update.priority)
    provider.quota_limit = str(provider_update.quota_limit)
    
    db.commit()
    db.refresh(provider)
    return provider

@router.delete("/{provider_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_provider(
    provider_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    provider = db.query(models.APIProvider).filter(models.APIProvider.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    db.delete(provider)
    db.commit()
    return {"ok": True}

@router.get("/status")
def get_provider_status(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    from api_hub import api_hub
    return api_hub.get_provider_status()
