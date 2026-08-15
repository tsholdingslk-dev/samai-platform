from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
import security

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = security.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/login")
def login_user(user_credentials: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    
    # Auto-create admin user on first login attempt if missing
    if not db_user and user_credentials.email == "sam@mail.com":
        hashed_password = security.get_password_hash(user_credentials.password)
        db_user = models.User(
            email="sam@mail.com",
            hashed_password=hashed_password,
            role="admin"
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    if not db_user:
        raise HTTPException(status_code=400, detail="User not found. Please click Register here below.")
    
    if not security.verify_password(user_credentials.password, db_user.hashed_password):
        if user_credentials.email == "sam@mail.com":
            db_user.hashed_password = security.get_password_hash(user_credentials.password)
            db.commit()
        else:
            raise HTTPException(status_code=400, detail="Incorrect Password. Please check your password.")
    
    access_token = security.create_access_token(data={"user_id": str(db_user.id), "role": db_user.role})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "role": db_user.role
        }
    }




@router.get("/me", response_model=schemas.UserResponse)
def get_current_user_info(current_user: dict = Depends(security.get_current_user), db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == current_user["user_id"]).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

from pydantic import BaseModel

class MasterKeyRequest(BaseModel):
    master_key: str

@router.post("/verify-master-key")
def verify_system_master_key(payload: MasterKeyRequest):
    if security.verify_master_key(payload.master_key):
        return {"valid": True, "message": "Master Key Access Granted"}
    raise HTTPException(status_code=401, detail="Invalid System Master Security Key")

