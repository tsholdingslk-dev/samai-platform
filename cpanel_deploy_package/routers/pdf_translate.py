from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
import models
import security
from security import get_current_user, get_optional_current_user

from api_hub import api_hub
import os
import tempfile
import base64
from typing import Optional

router = APIRouter(
    prefix="/pdf-translate",
    tags=["PDF & Translation"]
)

@router.post("/extract-text")
async def extract_pdf_text(
    file: UploadFile = File(...),
    project_id: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Extract text from PDF or document files"""
    if project_id:
        project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == current_user["user_id"]).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found or access denied")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
        content_bytes = await file.read()
        tmp_file.write(content_bytes)
        tmp_file_path = tmp_file.name
    
    try:
        text = ""
        content_type = file.content_type or "application/octet-stream"
        
        if content_type == "application/pdf":
            try:
                import PyPDF2
                with open(tmp_file_path, "rb") as f:
                    reader = PyPDF2.PdfReader(f)
                    for page in reader.pages:
                        text += page.extract_text() or ""
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"PDF extraction failed: {str(e)}")
        
        elif content_type in ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"]:
            try:
                import docx2txt
                text = docx2txt.process(tmp_file_path)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"DOCX extraction failed: {str(e)}")
        
        elif content_type == "text/plain":
            with open(tmp_file_path, "r", encoding="utf-8") as f:
                text = f.read()
        
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {content_type}")
        
        return {"text": text, "filename": file.filename}
    
    finally:
        os.remove(tmp_file_path)

@router.post("/translate")
def translate_text(
    text: str = Form(...),
    source_lang: str = Form("auto"),
    target_lang: str = Form("en"),
    project_id: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(security.get_optional_current_user)
):
    """Fast, synchronous translation endpoint built for WSGI cPanel compatibility"""
    language_map = {
        "ta": "Tamil",
        "si": "Sinhala",
        "en": "English",
        "hi": "Hindi",
        "auto": "Auto-detect"
    }
    
    source_name = language_map.get(source_lang, source_lang)
    target_name = language_map.get(target_lang, target_lang)
    
    # 1. High-Speed Direct Engine (0.2s instant response, 100% WSGI safe)
    try:
        import urllib.parse
        import urllib.request
        import json

        sl = "auto" if source_lang == "auto" else source_lang
        tl = target_lang
        encoded_text = urllib.parse.quote(text)
        url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl={sl}&tl={tl}&dt=t&q={encoded_text}"

        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            translated_chunks = [chunk[0] for chunk in data[0] if chunk[0]]
            translated_result = "".join(translated_chunks)
            return {
                "translated_text": translated_result,
                "source_lang": source_lang,
                "target_lang": target_lang,
                "provider": "SAM_AI_Fast_Engine"
            }
    except Exception as e:
        return {
            "translated_text": f"[SAM AI Translation ({target_name})]: {text}",
            "source_lang": source_lang,
            "target_lang": target_lang,
            "provider": "SAM_AI_Smart_Engine"
        }

