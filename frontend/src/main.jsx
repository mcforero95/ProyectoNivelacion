import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Componente principal
import './index.css'; // Estilos base

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> {/* Renderiza la aplicación principal */}
  </React.StrictMode>
);
