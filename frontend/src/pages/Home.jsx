import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

const Home = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(form); // Llama al endpoint de inicio de sesión
      alert('Inicio de sesión exitoso');
      localStorage.setItem('token', response.access_token); // Guarda el token en el almacenamiento local
      navigate('/dashboard'); // Redirige al dashboard después de iniciar sesión
    } catch (error) {
      alert('Credenciales incorrectas');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="container" align="center" borderTop="1px solid black">
      <h2 align="center">Bienvenido</h2>
      <form onSubmit={handleLogin} align="center">
        <div >
        <input
          type="text"
          placeholder="Usuario"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          align="center"
        />
        </div>
        <div style={{ marginTop: '5px' }}></div>
        <div >
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          align="center"
        />
        </div>
        <div style={{ marginTop: '5px' }}></div>
        <div>
        <button type="submit" align="center">Login</button>
        </div>
      </form>
      <div style={{ marginTop: '10px' }}>
        <a align="center" href="/register">¿No tienes Cuenta? Regístrate</a>
      </div>
    </div>
  );
};

export default Home;
