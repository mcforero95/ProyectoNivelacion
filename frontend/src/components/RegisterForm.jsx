import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

const RegisterForm = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.register(form); // Llama al endpoint de registro
      alert('Usuario registrado exitosamente');
      navigate('/login'); // Redirige al login tras el registro
    } catch (error) {
      alert('Error al registrar usuario');
    }
  };

  return (
    <div className="container">
      <h2>Registro</h2>
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
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterForm;
