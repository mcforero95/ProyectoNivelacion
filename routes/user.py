from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from tareas_app.database import get_db
from tareas_app.models.user import User
from tareas_app.schemas.user import UserCreate, UserResponse
from passlib.context import CryptContext
from jose import jwt
from datetime import timedelta
from tareas_app.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter()

# Ruta para registrar un nuevo usuario
@router.post("/usuarios", response_model=UserResponse)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_data.username).first()
    if user:
        raise HTTPException(status_code=400, detail="Usuario ya registrado")
    hashed_password = pwd_context.hash(user_data.password)
    new_user = User(username=user_data.username, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Ruta para iniciar sesión de un usuario
@router.post("/usuarios/iniciar-sesion")
def login_user(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user or not pwd_context.verify(password, user.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = jwt.encode({"sub": user.username, "exp": access_token_expires}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": access_token, "token_type": "bearer"}
