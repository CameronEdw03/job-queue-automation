from fastapi import FastAPI, Depends
from sqlalchemy import text, select
from database import engine 
from sqlalchemy.orm import Session
from database import get_db
from models import Task, Reminders


app = FastAPI()

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
       