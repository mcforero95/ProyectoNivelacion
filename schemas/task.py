from pydantic import BaseModel
from datetime import date
from typing import Optional

# Esquema para la creación de tareas
class TaskCreate(BaseModel):
    """
    Modelo para validar la creación de una tarea.
    """
    texto_tarea: str  # Descripción de la tarea
    fecha_tentativa_finalizacion: date  # Fecha tentativa de finalización
    estado: str  # Estado de la tarea (Ej: 'Sin Empezar', 'En Progreso', 'Finalizada')
    id_usuario: int  # ID del usuario que creó la tarea
    id_categoria: int  # ID de la categoría a la que pertenece la tarea

# Esquema para la actualización de tareas
class TaskUpdate(BaseModel):
    """
    Modelo para validar la actualización de una tarea.
    Los campos son opcionales, lo que significa que no todos deben enviarse al actualizar.
    """
    texto_tarea: Optional[str] = None  # Nuevo texto de la tarea (opcional)
    estado: Optional[str] = None  # Nuevo estado de la tarea (opcional)

# Esquema para la respuesta de tareas
class TaskResponse(BaseModel):
    """
    Modelo de respuesta cuando se obtiene o crea una tarea.
    """
    id: int  # Identificador único de la tarea
    texto_tarea: str  # Descripción de la tarea
    fecha_tentativa_finalizacion: date  # Fecha tentativa de finalización
    estado: str  # Estado de la tarea
    id_usuario: int  # ID del usuario propietario de la tarea
    id_categoria: int  # ID de la categoría asociada

    class Config:
        from_attributes = True  # Permite convertir automáticamente de SQLAlchemy a Pydantic
