import { useEffect, useState } from 'react';
import { categoriesAPI } from '../api';

const CategoryList = () => {
  const [categories, setCategories] = useState([]); // Estado para almacenar las categorías

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getCategories(); // Obtiene las categorías desde la API
        setCategories(response.data);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="category-list">
      <h3>Categorías</h3>
      <ul>
        {categories.map((category) => (
          <li key={category.id} className="category-item">
            {category.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
