import os
import uuid
import shutil
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends

from app.utils.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/upload", tags=["File & Image Uploads"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".pdf"}
MAX_FILE_SIZE_MB = 10  

def _get_upload_dir() -> str:
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    upload_dir = os.path.join(project_root, "static", "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    return upload_dir

@router.post(
    "/image",
    status_code=status.HTTP_201_CREATED,
    summary="Upload a single image or document file"
)
async def upload_single_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):

    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{file_ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    upload_dir = _get_upload_dir()
    file_path = os.path.join(upload_dir, unique_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {str(e)}"
        )
    finally:
        await file.close()

    relative_url = f"/static/uploads/{unique_filename}"
    full_url = f"http://127.0.0.1:8000{relative_url}"

    return {
        "filename": file.filename,
        "saved_filename": unique_filename,
        "content_type": file.content_type,
        "url": relative_url,
        "full_url": full_url,
        "uploaded_by": current_user.email
    }

@router.post(
    "/multiple",
    status_code=status.HTTP_201_CREATED,
    summary="Upload multiple images at once"
)
async def upload_multiple_files(
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user)
):
    if len(files) > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 5 files allowed per upload request."
        )

    uploaded_files = []
    upload_dir = _get_upload_dir()

    for file in files:
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            continue 

        unique_filename = f"{uuid.uuid4().hex}{file_ext}"
        file_path = os.path.join(upload_dir, unique_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        await file.close()

        relative_url = f"/static/uploads/{unique_filename}"
        uploaded_files.append({
            "original_name": file.filename,
            "url": relative_url,
            "full_url": f"http://127.0.0.1:8000{relative_url}"
        })

    return {
        "total_uploaded": len(uploaded_files),
        "files": uploaded_files,
        "uploaded_by": current_user.email
    }