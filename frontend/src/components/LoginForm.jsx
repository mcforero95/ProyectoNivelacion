import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

const LoginForm = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.login(form); // Llama al endpoint de inicio de sesión
      alert('Inicio de sesión exitoso');
      navigate('/dashboard'); // Redirige al dashboard tras el login
    } catch (error) {
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div className="container">
      <h2>Bienvenido</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>
      <div style={{ marginTop: '10px' }}>
        <a href="/register">¿No tienes Cuenta? Regístrate</a>
      </div>
    </div>
  );
};

export default LoginForm;
