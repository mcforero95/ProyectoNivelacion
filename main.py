from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models.user import User
from models.task import Task
from models.category import Category
from schemas.user import UserCreate, UserResponse
from schemas.task import TaskCreate, TaskUpdate, TaskResponse
from schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, date
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter
from pydantic import BaseModel

# Configuración del contexto de hashing para contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="usuarios/iniciar-sesion")

# Función para verificar si una contraseña proporcionada coincide con la almacenada
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Función para obtener el hash de una contraseña antes de almacenarla
def get_password_hash(password):
    return pwd_context.hash(password)

# Función para crear un token de acceso con datos y un tiempo de expiración definido
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Función para obtener el usuario actual utilizando un token de acceso
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="No se pudo validar el token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# Inicializar la aplicación FastAPI
app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia esto a un dominio específico en producción
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos HTTP
    allow_headers=["*"],  # Permitir todos los encabezados
)

# Crear las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

class UserUpdate(BaseModel):
    password: str | None = None
    imgProfile: str | None = None

# Rutas para usuarios
@app.post("/usuarios", response_model=UserResponse)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_data.username).first()
    if user:
        raise HTTPException(status_code=400, detail="Usuario ya registrado")
    hashed_password = get_password_hash(user_data.password)
    new_user = User(username=user_data.username, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/usuarios/iniciar-sesion")
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/usuarios/refresh-token")
def refresh_token(current_user: User = Depends(get_current_user)):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/usuarios/me", response_model=UserResponse)
def get_current_user_data(current_user: User = Depends(get_current_user)):
    """
    Retorna los datos del usuario autenticado.
    """
    return current_user

@app.put("/usuarios/update-profile", dependencies=[Depends(get_current_user)])
def update_profile(user_update: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Permite a los usuarios actualizar su contraseña e imagen de perfil."""
    if user_update.password:
        current_user.password = get_password_hash(user_update.password)
    if user_update.imgProfile:
        current_user.imgProfile = user_update.imgProfile
    db.commit()
    return {"message": "Perfil actualizado exitosamente"}


@app.post("/usuarios/logout")
def logout_user():
    return {"message": "Sesión cerrada exitosamente"}

# Rutas para tareas
@app.get("/usuarios/{id}/tareas", dependencies=[Depends(get_current_user)])
def get_tasks_by_user(id: int, db: Session = Depends(get_db)):
    """Obtiene todas las tareas de un usuario junto con el nombre de la categoría."""
    tasks = (
        db.query(
            Task.id,
            Task.texto_tarea,
            Task.fecha_tentativa_finalizacion,
            Task.estado,
            Task.fecha_creacion,
            Category.nombre.label("categoria_nombre")  # Obtener el nombre de la categoría
        )
        .join(Category, Task.id_categoria == Category.id)
        .filter(Task.id_usuario == id)
        .all()
    )

    # Convertir los resultados en una lista de diccionarios
    return [
        {
            "id": task.id,
            "texto_tarea": task.texto_tarea,
            "estado": task.estado,
            "fecha_creacion": task.fecha_creacion,
            "fecha_tentativa_finalizacion": task.fecha_tentativa_finalizacion,
            "categoria_nombre": task.categoria_nombre,  # Nombre de la categoría
        }
        for task in tasks
    ]


@app.get("/tareas/{id}", response_model=TaskResponse, dependencies=[Depends(get_current_user)])
def get_task_by_id(id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return task

@app.post("/tareas", response_model=TaskResponse, dependencies=[Depends(get_current_user)])
def create_task(task_data: TaskCreate, db: Session = Depends(get_db)):
    if task_data.fecha_tentativa_finalizacion < date.today():
        raise HTTPException(status_code=400, detail="La fecha de finalización no puede ser anterior a hoy")
    nueva_tarea = Task(**task_data.dict(), fecha_creacion=date.today())
    db.add(nueva_tarea)
    db.commit()
    db.refresh(nueva_tarea)
    return nueva_tarea

@app.put("/tareas/{id}", dependencies=[Depends(get_current_user)])
def update_task(id: int, task_data: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    if task_data.texto_tarea:
        task.texto_tarea = task_data.texto_tarea
    if task_data.estado:
        task.estado = task_data.estado
    db.commit()
    return {"message": "Tarea actualizada exitosamente"}

@app.delete("/tareas/{id}", dependencies=[Depends(get_current_user)])
def delete_task(id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    db.delete(task)
    db.commit()
    return {"message": "Tarea eliminada exitosamente"}

# Rutas para categorías
PREDEFINED_CATEGORIES = [
    {"nombre": "Hogar", "descripcion": "Tareas relacionadas con el hogar"},
    {"nombre": "Trabajo", "descripcion": "Tareas laborales o profesionales"},
    {"nombre": "Urgente", "descripcion": "Tareas que necesitan atención inmediata"},
]

@app.get("/categorias", response_model=list[CategoryResponse], dependencies=[Depends(get_current_user)])
def get_categories(db: Session = Depends(get_db)):
    """Obtiene todas las categorías. Si no existen categorías, crea las predefinidas."""
    categories = db.query(Category).all()
    if not categories:
        for predefined in PREDEFINED_CATEGORIES:
            new_category = Category(nombre=predefined["nombre"], descripcion=predefined["descripcion"])
            db.add(new_category)
        db.commit()
        categories = db.query(Category).all()
    return categories

@app.post("/categorias", response_model=CategoryResponse, dependencies=[Depends(get_current_user)])
def create_category(category_data: CategoryCreate, db: Session = Depends(get_db)):
    """Crea una nueva categoría."""
    existing_category = db.query(Category).filter(Category.nombre == category_data.nombre).first()
    if existing_category:
        raise HTTPException(status_code=400, detail="La categoría ya existe")
    nueva_categoria = Category(**category_data.dict())
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return nueva_categoria

@app.delete("/categorias/{id}", status_code=204, dependencies=[Depends(get_current_user)])
def delete_category(id: int, db: Session = Depends(get_db)):
    """Elimina una categoría existente."""
    category = db.query(Category).filter(Category.id == id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    db.delete(category)
    db.commit()

# Ruta raíz para verificar el estado de la API
@app.get("/")
def home():
    return {"message": "Bienvenido a la API de Gestión de Tareas"}

# Configuración para ejecutar el servidor con Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
