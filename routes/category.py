from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.category import Category
from schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter()

# Ruta para crear una nueva categoría
@router.post("/categorias", response_model=CategoryResponse)
def create_category(category_data: CategoryCreate, db: Session = Depends(get_db)):
    nueva_categoria = Category(**category_data.dict())
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return nueva_categoria

# Ruta para actualizar una categoría existente
@router.put("/categorias/{id}")
def update_category(id: int, category_data: CategoryUpdate, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    if category_data.nombre:
        category.nombre = category_data.nombre
    if category_data.descripcion:
        category.descripcion = category_data.descripcion
    db.commit()
    return {"message": "Categoría actualizada correctamente"}

# Ruta para eliminar una categoría
@router.delete("/categorias/{id}")
def delete_category(id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    db.delete(category)
    db.commit()
    return {"message": "Categoría eliminada correctamente"}
