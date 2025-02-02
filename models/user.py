from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

# Definición del modelo de Usuario en la base de datos
class User(Base):
    __tablename__ = "users"  # Nombre de la tabla en la base de datos

    id = Column(Integer, primary_key=True, index=True)  # Identificador único del usuario
    username = Column(String, unique=True, index=True)  # Nombre de usuario único
    password = Column(String)  # Contraseña encriptada
    imgProfile = Column(String, default="default.png")  # Imagen de perfil (opcional, con valor predeterminado)

    # Relación con las tareas que posee este usuario
    tareas = relationship("Task", back_populates="usuario")  # Define la relación con el modelo Task
