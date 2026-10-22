from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy import text, select
from database import engine 
from sqlalchemy.orm import Session
from database import get_db
from models import Task, Reminders
from datetime import datetime, timezone 
from pydantic import BaseModel, Field
from typing import Optional


app = FastAPI()

class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    due_at: datetime | None = None

class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    due_at: datetime | None = None
    completed_at: datetime | None = None


class ReminderCreate(BaseModel):
    goal_int: int
    reminder_time: datetime
    frequency: str 
    is_enabled: bool = True

class ReminderUpdate(BaseModel):
    reminder_time: datetime | None = None
    frequency: str | None = None
    is_enabled: bool | None = None 



@app.get("/")
def home():
    return {"message": "Nudge API is running"}

@app.get("/db-check")
def check_database():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {"message": "Connected to PostgreSQL successfully"}

@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    statement = select(Task).order_by(Task.id)
    tasks = db.scalars(statement).all()


@app.get("/reminders")
def get_reminders(db: Session = Depends(get_db)):
    statement = select(Reminders).order_by(Reminders.id)
    reminders = db.scalars(statement).all()


@app.post("/tasks", status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db)
):
    new_task = Task(
        title=task_data.title,
        description=task_data.description,
        due_at=task_data.due_at,
        created_at=datetime.now(timezone.utc),
        completed_at=None
    )

    try: 
        db.add(new_task)
        db.commit()
        db.refresh(new_task)

        return {
            "id": new_task.id,
            "title": new_task.title,
            "description": new_task.description,
            "due_at": new_task.due_at,
            "completed_at": new_task.completed_at,
            "created_at": new_task.created_at
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create task: {str(e)}"
        )


@app.get("/tasks/{task_id}")
def get_task_by_id(
    task_id: int,
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if task is None:
        raise HTTPException(
            status_code=404,
            detail=f"Task with ID {task_id} not found"
        )

    return task

@app.patch("/tasks/{task_id}")
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if task is None:
        raise HTTPException(
            status_code=404,
            detail=f"Task with ID {task_id} not found"
        )


@app.post("/reminders", status_code=status.HTTP_201_CREATED)
def create_reminder(
    reminder_data: ReminderCreate,
    db: Session = Depends(get_db)
):
    new_reminder = Reminders(
        goal_id=reminder_data.goal_id,
        reminder_time=reminder_data.reminder_time,
        frequency=reminder_data.frequency,
        is_enabled=reminder_data.is_enabled,
        created_at=datetime.now(timezone.utc)
    )

    try:
        db.add(new_reminder)
        db.commit()
        db.refresh(new_reminder)

        return new_reminder

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to create reminder"
        )


@app.get("/reminders")
def get_reminders(db: Session = Depends(get_db)):
    reminders = db.query(Reminders).all()
    return reminders



@app.get("/reminders/{reminder_id}")
def get_reminder(
    reminder_id: int,
    db: Session = Depends(get_db)
):
    reminder = (
        db.query(Reminders)
        .filter(Reminders.id == reminder_id)
        .first()
    )

    if reminder is None:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found"
        )

    return reminder


@app.patch("/reminders/{reminder_id}")
def update_reminder(
    reminder_id: int,
    reminder_data: ReminderUpdate,
    db: Session = Depends(get_db)
):
    reminder = (
        db.query(Reminders)
        .filter(Reminders.id == reminder_id)
        .first()
    )

    if reminder is None:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found"
        )

    updates = reminder_data.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(reminder, field, value)

    try:
        db.commit()
        db.refresh(reminder)
        return reminder

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to update reminder"
        )