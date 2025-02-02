import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado para almacenar el usuario autenticado

  // Cargar el usuario desde el token en el inicio
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await authAPI.getProfile();
        setUser(response.data);
      } catch {
        logout();
      }
    };
    loadUser();
  }, []);

  // Función para iniciar sesión
  const login = async (username, password) => {
    const response = await authAPI.login({ username, password });
    localStorage.setItem('token', response.data.access_token);
    const profile = await authAPI.getProfile();
    setUser(profile.data);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
