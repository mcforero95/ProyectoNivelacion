import React, { useEffect, useState } from "react";
import { categoriesAPI } from "../api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ nombre: "", descripcion: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  // Obtener categorías desde la API
  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response);
    } catch (error) {
      console.error("❌ Error obteniendo las categorías:", error);
    }
  };

  // Crear una nueva categoría
  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!newCategory.nombre.trim() || !newCategory.descripcion.trim()) {
      alert("⚠️ Los campos de categoría no pueden estar vacíos.");
      return;
    }

    try {
      const response = await categoriesAPI.createCategory(newCategory);
      setCategories([...categories, response]); // Agregar la nueva categoría a la lista
      setNewCategory({ nombre: "", descripcion: "" }); // Limpiar el formulario
      alert("✅ Categoría creada exitosamente.");
    } catch (error) {
      console.error("❌ Error creando la categoría:", error);
      alert("⚠️ No se pudo crear la categoría. Verifica si ya existe o si el servidor está activo.");
    }
  };

  // Eliminar una categoría
  const handleDeleteCategory = async (id) => {
    try {
      await categoriesAPI.deleteCategory(id);
      setCategories(categories.filter((category) => category.id !== id)); // Eliminar categoría localmente
      alert("✅ Categoría eliminada exitosamente.");
    } catch (error) {
      console.error("❌ Error eliminando la categoría:", error);
      alert("⚠️ No se pudo eliminar la categoría.");
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 max-w-3xl border shadow-lg rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Gestión de Categorías</h2>

      {/* Formulario para crear categorías */}
      <form onSubmit={handleCreateCategory} className="mb-6">
        <label className="block text-gray-700">Nombre de la Categoría:</label>
        <input
          type="text"
          placeholder="Ejemplo: Personal, Trabajo..."
          value={newCategory.nombre}
          onChange={(e) => setNewCategory({ ...newCategory, nombre: e.target.value })}
          required
          className="w-full p-2 border rounded mt-2"
        />

        <label className="block text-gray-700 mt-4">Descripción:</label>
        <input
          type="text"
          placeholder="Breve descripción..."
          value={newCategory.descripcion}
          onChange={(e) => setNewCategory({ ...newCategory, descripcion: e.target.value })}
          required
          className="w-full p-2 border rounded mt-2"
        />

        <button
          type="submit"
          className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Crear Categoría
        </button>
      </form>

      {/* Tabla de categorías */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 shadow-sm rounded-lg border-collapse">
          <thead>
            <tr className="bg-gray-200 border border-gray-400">
              <th className="border border-gray-300 px-4 py-2">Nombre</th>
              <th className="border border-gray-300 px-4 py-2">Descripción</th>
              <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id} className="text-center border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">{category.nombre}</td>
                  <td className="border border-gray-300 px-4 py-2">{category.descripcion}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="bg-red-500 px-3 py-1 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No hay categorías registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
