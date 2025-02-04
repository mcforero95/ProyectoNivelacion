import axios from 'axios';

// Configuración base para la API
const API_BASE_URL = 'http://backend-container:8080'; // Cambia esto si tu backend usa otro puerto

// Crea una instancia de Axios con configuración predeterminada
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autorización a cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obtiene el token almacenado en el navegador
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funciones para interactuar con la API
export const authAPI = {
  login: async (data) => {
    const params = new URLSearchParams();
    for (const key in data) {
      params.append(key, data[key]);
    }
    const response = await api.post('/usuarios/iniciar-sesion', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  },
  register: async (data) => {
    const response = await api.post('/usuarios', data);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/usuarios/me');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/usuarios/update-profile', data);
    return response.data;
  },
};

export const tasksAPI = {
  getTasksByUser: async (userId) => {
    const response = await api.get(`/usuarios/${userId}/tareas`);
    return response.data;
  },
  createTask: async (data) => {
    const response = await api.post('/tareas', data);
    return response.data;
  },
  updateTask: async (taskId, data) => {
    const response = await api.put(`/tareas/${taskId}`, data);
    return response.data;
  },
  deleteTask: async (taskId) => {
    const response = await api.delete(`/tareas/${taskId}`);
    return response.data;
  },
};

export const categoriesAPI = {
  getCategories: async () => {
    const response = await api.get('/categorias');
    return response.data;
  },
  createCategory: async (data) => {
    const response = await api.post('/categorias', data);
    return response.data;
  },
  updateCategory: async (categoryId, data) => {
    const response = await api.put(`/categorias/${categoryId}`, data);
    return response.data;
  },
  deleteCategory: async (categoryId) => {
    const response = await api.delete(`/categorias/${categoryId}`);
    return response.data;
  },
};



