from pydantic import BaseModel

# Esquema para la creación de usuarios
class UserCreate(BaseModel):
    username: str
    password: str
    imgProfile: str | None = None  # Campo opcional

# Esquema para la actualización de usuarios
class UserUpdate(BaseModel):
    username: str | None = None  # Campo opcional
    password: str | None = None  # Campo opcional
    imgProfile: str | None = None  # Campo opcional

# Esquema para la respuesta de usuarios
class UserResponse(BaseModel):
    id: int
    username: str
    imgProfile: str

    class Config:
        from_attributes = True
