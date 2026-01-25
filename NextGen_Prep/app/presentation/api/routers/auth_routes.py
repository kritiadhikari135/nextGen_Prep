from fastapi import APIRouter, HTTPException, Depends
from presentation.schemas.user_schema import SignupRequest, LoginRequest, RefreshRequest
from presentation.dependencies import get_db, get_current_user
from application.auth.register_usecase import register_user
from application.auth.login_usecase import login_user
from infrastructure.security.jwt_service import (
    decode_refresh_token,
    create_access_token,
)
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])


# ==================== SIGNUP ====================
@router.post("/signup")
def signup(request: SignupRequest):
    """
    Register a new user.
    """
    try:
        logger.info(f"Signup attempt for email: {request.email}")
        result = register_user(
            name=request.name,
            email=request.email,
            password=request.password,
            role=request.role,
        )
        logger.info(f"Signup successful for email: {request.email}")
        return result
    except ValueError as ve:
        logger.warning(f"Signup validation error for {request.email}: {ve}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(
            f"Unexpected error during signup for {request.email}: {e}", exc_info=True
        )
        raise HTTPException(status_code=500, detail="Internal Server Error")


# ==================== LOGIN ====================
@router.post("/login")
def login(request: LoginRequest):
    """
    Authenticate a user and return access & refresh tokens.
    """
    try:
        logger.info(f"Login attempt for email: {request.email}")
        result = login_user(email=request.email, password=request.password)
        logger.info(f"Login successful for email: {request.email}")
        return result
    except ValueError as ve:
        logger.warning(f"Login failed for {request.email}: {ve}")
        raise HTTPException(status_code=401, detail=str(ve))
    except Exception as e:
        logger.error(
            f"Unexpected error during login for {request.email}: {e}", exc_info=True
        )
        raise HTTPException(status_code=500, detail="Internal Server Error")


# ==================== TOKEN REFRESH ====================
@router.post("/refresh")
def refresh(request: RefreshRequest):
    """
    Refresh access token using a valid refresh token.
    """
    try:
        logger.info("Token refresh attempt")
        payload = decode_refresh_token(request.refresh_token)
        new_access_token = create_access_token(
            {"user_id": payload["user_id"], "role": payload["role"]}
        )
        logger.info(f"Token refresh successful for user_id: {payload.get('user_id')}")
        return {"access_token": new_access_token, "token_type": "bearer"}
    except Exception as e:
        logger.warning(f"Token refresh failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")


# ==================== GET CURRENT USER ====================
@router.get("/me")
def get_current_user_endpoint(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get the current authenticated user's information.
    """
    try:
        from infrastructure.db.models.user_model import UserModel
        
        user_id = current_user.get("user_id")
        user = db.query(UserModel).filter(UserModel.id == user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching current user: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

