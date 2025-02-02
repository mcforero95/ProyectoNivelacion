// Convierte una fecha en formato legible
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Opciones de estados para las tareas
export const taskStates = ['Sin Empezar', 'En Progreso', 'Finalizada'];
