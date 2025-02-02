import { useState } from 'react';
import { tasksAPI } from '../api';

const TaskForm = () => {
  const [task, setTask] = useState({ texto_tarea: '', estado: 'Sin Empezar' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tasksAPI.createTask(task);
      alert('Tarea creada');
      setTask({ texto_tarea: '', estado: 'Sin Empezar' });
    } catch (error) {
      alert('Error al crear tarea');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nueva tarea"
        value={task.texto_tarea}
        onChange={(e) => setTask({ ...task, texto_tarea: e.target.value })}
        required
      />
      <select
        value={task.estado}
        onChange={(e) => setTask({ ...task, estado: e.target.value })}
      >
        <option value="Sin Empezar">Sin Empezar</option>
        <option value="En Progreso">En Progreso</option>
        <option value="Finalizada">Finalizada</option>
      </select>
      <button type="submit">Crear Tarea</button>
    </form>
  );
};

export default TaskForm;
