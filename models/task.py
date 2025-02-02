from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base

# Definición del modelo de Tarea en la base de datos
class Task(Base):
    __tablename__ = "tasks"  # Nombre de la tabla en la base de datos

    id = Column(Integer, primary_key=True, index=True)  # Identificador único de la tarea
    texto_tarea = Column(String, index=True)  # Descripción o texto de la tarea
    fecha_creacion = Column(Date)  # Fecha de creación de la tarea
    fecha_tentativa_finalizacion = Column(Date)  # Fecha tentativa para finalizar la tarea
    estado = Column(String, default="Sin Empezar")  # Estado de la tarea (valor por defecto: 'Sin Empezar')
    id_usuario = Column(Integer, ForeignKey("users.id"))  # Relación con el usuario propietario
    id_categoria = Column(Integer, ForeignKey("categories.id"))  # Relación con la categoría de la tarea

    # Relación con el modelo User
    usuario = relationship("User", back_populates="tareas")
    categoria = relationship("Category", back_populates="tareas")  # Relación con Category

