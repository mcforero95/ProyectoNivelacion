from pydantic import BaseModel

# Esquema para la creación de categorías
class CategoryCreate(BaseModel):
    nombre: str
    descripcion: str

# Esquema para la actualización de categorías
class CategoryUpdate(BaseModel):
    nombre: str | None = None  # Campo opcional
    descripcion: str | None = None  # Campo opcional

# Esquema para la respuesta de categorías
class CategoryResponse(BaseModel):
    id: int
    nombre: str
    descripcion: str

    class Config:
        from_attributes = True
