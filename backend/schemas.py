from pydantic import BaseModel
from typing import List, Optional
import datetime

class UserBase(BaseModel):
    name: str
    role: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class SubmissionBase(BaseModel):
    content: str
    case_study_id: int

class SubmissionCreate(SubmissionBase):
    student_id: int

class Submission(SubmissionBase):
    id: int
    student_id: int
    feedback: Optional[str] = None
    submitted_at: datetime.datetime

    class Config:
        from_attributes = True

class SubmissionUpdate(BaseModel):
    feedback: str

class CaseStudyBase(BaseModel):
    title: str
    content: str

class CaseStudyCreate(CaseStudyBase):
    instructor_id: int

class CaseStudy(CaseStudyBase):
    id: int
    is_archived: bool
    created_at: datetime.datetime
    instructor_id: int
    submissions: List[Submission] = []

    class Config:
        from_attributes = True

class CaseStudyUpdate(BaseModel):
    is_archived: bool
