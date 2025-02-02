from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.task import Task
from database import get_db
from datetime import date

task_router = APIRouter()

@task_router.post("/tasks")
def create_task(
    texto_tarea: str,
    fecha_tentativa_finalizacion: date,
    estado: str,
    id_usuario: int,
    id_categoria: int,
    db: Session = Depends(get_db),
):
    nueva_tarea = Task(
        texto_tarea=texto_tarea,
        fecha_creacion=date.today(),
        fecha_tentativa_finalizacion=fecha_tentativa_finalizacion,
        estado=estado,
        id_usuario=id_usuario,
        id_categoria=id_categoria,
    )
    db.add(nueva_tarea)
    db.commit()
    return {"message": "Tarea creada exitosamente"}

@task_router.get("/tasks")
def list_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.task import Task
from schemas.task import TaskCreate, TaskUpdate, TaskResponse
from datetime import date

router = APIRouter()

# Ruta para obtener una tarea por ID
@router.get("/tareas/{id}", response_model=TaskResponse)
def get_task_by_id(id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return task

# Ruta para crear una nueva tarea
@router.post("/tareas", response_model=TaskResponse)
def create_task(task_data: TaskCreate, db: Session = Depends(get_db)):
    if task_data.fecha_tentativa_finalizacion < date.today():
        raise HTTPException(status_code=400, detail="La fecha de finalización no puede ser anterior a hoy")
    nueva_tarea = Task(**task_data.dict(), fecha_creacion=date.today())
    db.add(nueva_tarea)
    db.commit()
    db.refresh(nueva_tarea)
    return nueva_tarea

# Ruta para actualizar una tarea existente
@router.put("/tareas/{id}")
def update_task(id: int, task_data: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    if task_data.texto_tarea:
        task.texto_tarea = task_data.texto_tarea
    if task_data.estado:
        task.estado = task_data.estado
    db.commit()
    return {"message": "Tarea actualizada correctamente"}
