from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import crud, models, schemas
from database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Case Study Discussion API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Users
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)

@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)

# Case Studies
@app.post("/case-studies/", response_model=schemas.CaseStudy)
def create_case_study(case_study: schemas.CaseStudyCreate, db: Session = Depends(get_db)):
    return crud.create_case_study(db=db, case_study=case_study)

@app.get("/case-studies/", response_model=List[schemas.CaseStudy])
def read_case_studies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_case_studies(db, skip=skip, limit=limit)

@app.get("/case-studies/{case_study_id}", response_model=schemas.CaseStudy)
def read_case_study(case_study_id: int, db: Session = Depends(get_db)):
    db_cs = crud.get_case_study(db, case_study_id=case_study_id)
    if db_cs is None:
        raise HTTPException(status_code=404, detail="Case study not found")
    return db_cs

@app.patch("/case-studies/{case_study_id}/archive", response_model=schemas.CaseStudy)
def update_case_study(case_study_id: int, case_study: schemas.CaseStudyUpdate, db: Session = Depends(get_db)):
    return crud.update_case_study_archive(db, case_study_id=case_study_id, is_archived=case_study.is_archived)

# Submissions
@app.post("/submissions/", response_model=schemas.Submission)
def create_submission(submission: schemas.SubmissionCreate, db: Session = Depends(get_db)):
    return crud.create_submission(db=db, submission=submission)

@app.get("/case-studies/{case_study_id}/submissions/", response_model=List[schemas.Submission])
def read_submissions_for_case_study(case_study_id: int, db: Session = Depends(get_db)):
    return crud.get_submissions_for_case_study(db, case_study_id=case_study_id)

@app.post("/submissions/{submission_id}/feedback", response_model=schemas.Submission)
def add_feedback(submission_id: int, submission_update: schemas.SubmissionUpdate, db: Session = Depends(get_db)):
    db_submission = crud.add_feedback_to_submission(db, submission_id=submission_id, feedback=submission_update.feedback)
    if db_submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")
    return db_submission

@app.get("/seed")
def seed_db(db: Session = Depends(get_db)):
    # Create some mock users if none exist
    users = crud.get_users(db, limit=1)
    if not users:
        crud.create_user(db, schemas.UserCreate(name="Dr. Smith", role="instructor"))
        crud.create_user(db, schemas.UserCreate(name="Alice (Student)", role="student"))
        crud.create_user(db, schemas.UserCreate(name="Bob (Student)", role="student"))
        return {"msg": "Database seeded with default users"}
    return {"msg": "Already seeded"}
