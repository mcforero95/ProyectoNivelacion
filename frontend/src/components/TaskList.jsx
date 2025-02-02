import { useEffect, useState } from 'react';
import { tasksAPI } from '../api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await tasksAPI.getTasksByUser(1); // Cambiar a ID dinámico
      setTasks(response.data);
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <h3>Mis Tareas</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.texto_tarea} - {task.estado}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
