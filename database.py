import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Asegurar que la carpeta para la base de datos exista
os.makedirs("database", exist_ok=True)

# Definir la ubicación de la base de datos SQLite
DATABASE_URL = "sqlite:///./database/tareas.db"

# Crear el motor de base de datos
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Configurar la sesión de base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Definir la base para los modelos
Base = declarative_base()

# Función para obtener una sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
