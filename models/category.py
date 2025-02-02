from sqlalchemy import Column, Integer, String
from database import Base
from sqlalchemy.orm import relationship


# Definición del modelo de Categoría en la base de datos
class Category(Base):
    __tablename__ = "categories"  # Nombre de la tabla en la base de datos

    id = Column(Integer, primary_key=True, index=True)  # Identificador único de la categoría
    nombre = Column(String, unique=True, index=True)  # Nombre único de la categoría
    descripcion = Column(String)  # Descripción de la categoría
    
    tareas = relationship("Task", back_populates="categoria")  # Relación uno a muchos con la tabla de Tareas
