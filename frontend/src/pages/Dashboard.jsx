import React, { useEffect, useState } from 'react';
import { tasksAPI, authAPI, categoriesAPI } from '../api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [taskState, setTaskState] = useState('Sin Empezar');
  const [taskDate, setTaskDate] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUserId();
    fetchCategories();
  }, []);

  // Obtener userId del usuario autenticado
  const fetchUserId = async () => {
    try {
      const userData = await authAPI.getProfile();
      console.log("🔹 Usuario autenticado:", userData);
      setUserId(userData.id);
      fetchTasks(userData.id);
    } catch (error) {
      console.error('❌ Error al obtener el usuario autenticado:', error);
    }
  };

  // Cargar tareas del usuario autenticado
  const fetchTasks = async (id) => {
    if (!id) return;
    try {
      const response = await tasksAPI.getTasksByUser(id);
      console.log("📌 Tareas obtenidas:", response);
      setTasks(response);
    } catch (error) {
      console.error('❌ Error al obtener tareas:', error);
    }
  };

  // Cargar categorías
  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      console.log("📌 Categorías obtenidas:", response);
      setCategories(response);
    } catch (error) {
      console.error('❌ Error al obtener categorías:', error);
    }
  };

  // Crear una nueva tarea
  const handleCreateTask = async () => {
    if (!newTask.trim() || !selectedCategory || !taskDate) {
      alert("⚠️ Por favor, ingresa todos los datos requeridos.");
      return;
    }
    try {
      const taskData = {
        texto_tarea: newTask,
        estado: taskState,
        id_usuario: Number(userId),
        id_categoria: Number(selectedCategory),
        fecha_tentativa_finalizacion: taskDate,
      };

      console.log("📌 Enviando datos al backend:", taskData);

      await tasksAPI.createTask(taskData);
      setNewTask('');
      setTaskState('Sin Empezar');
      setTaskDate('');
      fetchTasks(userId);
      alert("✅ Tarea creada exitosamente.");
    } catch (error) {
      console.error('❌ Error al crear tarea:', error.response ? error.response.data : error);
      alert("⚠️ No se pudo crear la tarea. Verifica si el servidor está activo.");
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (taskId) => {
    try {
      await tasksAPI.deleteTask(taskId);
      fetchTasks(userId);
      alert("✅ Tarea eliminada exitosamente.");
    } catch (error) {
      console.error("❌ Error eliminando la tarea:", error);
      alert("⚠️ No se pudo eliminar la tarea.");
    }
  };

  // Modificar estado de la tarea
  const handleUpdateTaskState = async (taskId, newState) => {
    try {
      await tasksAPI.updateTask(taskId, { estado: newState });
      fetchTasks(userId);
      alert(`✅ Tarea actualizada a estado: ${newState}`);
    } catch (error) {
      console.error("❌ Error actualizando la tarea:", error);
      alert("⚠️ No se pudo actualizar la tarea.");
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 max-w-4xl border shadow-lg rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Gestión de Tareas</h2>

      {/* Formulario para crear tareas */}
      <div className="mb-4">
        <label className="block text-gray-700"> Tarea: </label>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea..."
          className="w-full p-2 border rounded mt-2"
        />

        <label className="block text-gray-700 mt-4">  Estado: </label>
        <select
          className="w-full p-2 mt-2 border rounded"
          onChange={(e) => setTaskState(e.target.value)}
          value={taskState}
        >
          <option value="Sin Empezar">Sin Empezar</option>
          <option value="En Progreso">En Progreso</option>
          <option value="Finalizada">Finalizada</option>
        </select>

        <label className="block text-gray-700 mt-4">  Fecha Tentativa de Finalización: </label>
        <input
          type="date"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
          className="w-full p-2 mt-2 border rounded"
        />

        <label className="block text-gray-700 mt-4">  Categoría: </label>
        <select
          className="w-full p-2 mt-2 border rounded"
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.nombre}</option>
          ))}
        </select>

        <button
          onClick={handleCreateTask}
          className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Crear Tarea
        </button>
      </div>

      {/* Tabla de tareas */}
      <div className="overflow-x-auto">
  <table className="w-full border border-gray-300 shadow-sm rounded-lg border-collapse">
    <thead>
      <tr className="bg-gray-200 border border-gray-400">
        <th className="border border-gray-300 px-4 py-2">Tarea</th>
        <th className="border border-gray-300 px-4 py-2">Estado</th>
        <th className="border border-gray-300 px-4 py-2">Fecha Creación</th>
        <th className="border border-gray-300 px-4 py-2">Fecha Finalización</th>
        <th className="border border-gray-300 px-4 py-2">Categoría</th>
        <th className="border border-gray-300 px-4 py-2">Acciones</th>
      </tr>
    </thead>
    <tbody>
  {tasks.length > 0 ? (
    tasks.map((task) => (
      <tr key={task.id} className="text-center border border-gray-300">
        <td className="border border-gray-300 px-4 py-2">{task.texto_tarea}</td>
        <td className="border border-gray-300 px-4 py-2">{task.estado}</td>
        <td className="border border-gray-300 px-4 py-2">{task.fecha_creacion}</td>
        <td className="border border-gray-300 px-4 py-2">{task.fecha_tentativa_finalizacion}</td>
        <td className="border border-gray-300 px-4 py-2 font-bold">
          {task.categoria_nombre} {/* Ahora muestra el nombre en vez del ID */}
        </td>
        <td className="border border-gray-300 px-4 py-2">
          <button
            onClick={() => handleUpdateTaskState(task.id, "En Progreso")}
            className="bg-yellow-500 px-2 py-1 text-white rounded hover:bg-yellow-600 mx-1"
          >
            En Progreso
          </button>
          <button
            onClick={() => handleUpdateTaskState(task.id, "Finalizada")}
            className="bg-blue-500 px-2 py-1 text-white rounded hover:bg-blue-600 mx-1"
          >
            Finalizada
          </button>
          <button
            onClick={() => handleDeleteTask(task.id)}
            className="bg-red-500 px-3 py-1 text-white rounded hover:bg-red-600 mx-1"
          >
            Eliminar
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="text-center p-4 text-gray-500">No hay tareas registradas.</td>
    </tr>
  )}
</tbody>

  </table>
</div>

  </div>
  );
};

export default Dashboard;
