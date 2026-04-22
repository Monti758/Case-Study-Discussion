from sqlalchemy.orm import Session
import models, schemas

# user functions
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(name=user.name, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# case study functions
def get_case_studies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CaseStudy).order_by(models.CaseStudy.created_at.desc()).offset(skip).limit(limit).all()

def get_case_study(db: Session, case_study_id: int):
    return db.query(models.CaseStudy).filter(models.CaseStudy.id == case_study_id).first()

def create_case_study(db: Session, case_study: schemas.CaseStudyCreate):
    db_item = models.CaseStudy(**case_study.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_case_study_archive(db: Session, case_study_id: int, is_archived: bool):
    db_item = get_case_study(db, case_study_id)
    if db_item:
        db_item.is_archived = is_archived
        db.commit()
        db.refresh(db_item)
    return db_item

# submission functions
def create_submission(db: Session, submission: schemas.SubmissionCreate):
    db_item = models.Submission(**submission.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_submissions_for_case_study(db: Session, case_study_id: int):
    return db.query(models.Submission).filter(models.Submission.case_study_id == case_study_id).all()

def add_feedback_to_submission(db: Session, submission_id: int, feedback: str):
    db_item = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if db_item:
        db_item.feedback = feedback
        db.commit()
        db.refresh(db_item)
    return db_item
