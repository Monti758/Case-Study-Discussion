from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    role = Column(String) # "instructor" or "student"

    case_studies = relationship("CaseStudy", back_populates="instructor")
    submissions = relationship("Submission", back_populates="student")

class CaseStudy(Base):
    __tablename__ = "case_studies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    instructor_id = Column(Integer, ForeignKey("users.id"))

    instructor = relationship("User", back_populates="case_studies")
    submissions = relationship("Submission", back_populates="case_study")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    feedback = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)

    student_id = Column(Integer, ForeignKey("users.id"))
    case_study_id = Column(Integer, ForeignKey("case_studies.id"))

    student = relationship("User", back_populates="submissions")
    case_study = relationship("CaseStudy", back_populates="submissions")
