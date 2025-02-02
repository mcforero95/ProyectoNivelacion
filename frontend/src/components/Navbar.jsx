import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar si el usuario tiene un token guardado (está autenticado)
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Convertimos el valor en booleano

    if (token) {
      fetchUserProfile();
    }
  }, [location]);

  // Obtener información del usuario autenticado
  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response);
    } catch (error) {
      console.error("❌ Error al obtener usuario:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token del usuario
    setIsAuthenticated(false);
    navigate('/'); // Redirigir al home (login)
    window.location.reload(); // Forzar la recarga para limpiar el estado
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-lg">
      {/* Menú Hamburguesa y Título */}
      <div className="flex items-center">
        <button onClick={() => setMenuOpen(!menuOpen)} className="bg-blue-500 px-4 py-2 rounded">
          ☰ Menú
        </button>
      </div>

      {/* Opciones del Menú Desplegable */}
      {menuOpen && (
        <div className="absolute left-0 top-16 w-48 bg-white text-black rounded shadow-lg p-2">
          <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-200">Tareas</Link>
          <div style={{ marginTop: '5px' }}></div>
          <Link to="/categories" className="block px-4 py-2 hover:bg-gray-200">Categorías</Link>
          <div style={{ marginTop: '5px' }}></div>
          <Link to="/users" className="block px-4 py-2 hover:bg-gray-200">Perfil</Link>
        </div>
      )}

      {/* Enlaces de Sesión a la Derecha */}
      <div className="flex items-center space-x-6" align="right">
        {isAuthenticated ? (
          <>
            <label className="cursor-pointer"> Bienvenido, {user?.username}  </label>
            {user && user.imgProfile && (
              <img
                src={user.imgProfile}
                alt="Perfil"
                className="rounded-full border shadow-md"
                style={{ width: "37px", height: "37px", objectFit: "cover" }}
              />
            )}
            <div style={{ marginTop: '5px' }}></div>
            <Link to="/dashboard" className="hover:underline">Inicio</Link>
            <span> | </span>
            <Link onClick={handleLogout} className="hover:underline">Cerrar Sesion</Link>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
