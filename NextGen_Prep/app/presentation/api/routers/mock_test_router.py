from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from presentation.dependencies import get_db, admin_required
from presentation.schemas.mock_test_schema import MockTestOut, MockTestUpdate
from infrastructure.repositories.mock_test_repo_impl import MockTestRepository
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/mock-tests", tags=["mock_tests"])


@router.get("", response_model=list[MockTestOut])
async def get_all_mock_tests(
    db: Session = Depends(get_db),
):
    """Get all mock tests."""
    try:
        repo = MockTestRepository(db)
        mock_tests = repo.get_all()
        return [
            MockTestOut(
                id=mt.id,
                title=mt.title,
                total_questions=len(mt.questions) if mt.questions else 0,
            )
            for mt in mock_tests
        ]
    except Exception as e:
        logger.error(f"Error fetching mock tests: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/{mock_test_id}", response_model=MockTestOut)
async def get_mock_test(
    mock_test_id: int,
    db: Session = Depends(get_db),
):
    """Get a specific mock test by ID."""
    try:
        repo = MockTestRepository(db)
        mock_test = repo.get_by_id(mock_test_id)
        return MockTestOut(
            id=mock_test.id,
            title=mock_test.title,
            total_questions=len(mock_test.questions) if mock_test.questions else 0,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching mock test {mock_test_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.patch("/{mock_test_id}", response_model=MockTestOut)
async def update_mock_test(
    mock_test_id: int,
    data: MockTestUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(admin_required),
):
    """Update a mock test."""
    try:
        repo = MockTestRepository(db)
        mock_test = repo.get_by_id(mock_test_id)
        
        if data.title:
            mock_test.title = data.title
        
        db.commit()
        db.refresh(mock_test)
        
        logger.info(f"Admin {admin['user_id']} updated mock test {mock_test_id}")
        
        return MockTestOut(
            id=mock_test.id,
            title=mock_test.title,
            total_questions=len(mock_test.questions) if mock_test.questions else 0,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating mock test {mock_test_id}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.delete("/{mock_test_id}")
async def delete_mock_test(
    mock_test_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(admin_required),
):
    """Delete a mock test."""
    try:
        repo = MockTestRepository(db)
        mock_test = repo.get_by_id(mock_test_id)
        
        db.delete(mock_test)
        db.commit()
        
        logger.info(f"Admin {admin['user_id']} deleted mock test {mock_test_id}")
        
        return {"message": "Mock test deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error deleting mock test {mock_test_id}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")
