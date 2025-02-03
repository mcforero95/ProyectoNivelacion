# README - Aplicación de Gestión de Tareas

## Descripción
Esta aplicación permite la gestión de tareas personales con autenticación de usuarios, categorización de tareas y almacenamiento seguro.
La aplicación está dividida en dos partes:
1. **Backend:** Implementado con **FastAPI** y SQLite.
2. **Frontend:** Desarrollado con **React.js** y TailwindCSS para estilos.

---

## 1️⃣ **Ejecutar con Docker**

### 📌 **Requisitos**
Antes de ejecutar la aplicación, asegúrate de tener instalado:
- **Docker**
- **Docker Compose**

Si no tienes Docker y Docker Compose instalados, puedes descargarlos e instalarlos desde:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Guía de instalación de Docker](https://docs.docker.com/get-docker/)

### 🏗 **Construcción de Imágenes**
Ejecuta los siguientes comandos en la raíz del proyecto para construir las imágenes de Docker:

```bash
# Construir imagen del backend
docker build -t gestion-tareas-backend -f Dockerfile .

# Construir imagen del frontend
docker build -t gestion-tareas-frontend -f frontend/Dockerfile frontend
```

### 🌐 **Crear y conectar la red Docker**
Para que el frontend pueda comunicarse con el backend, es necesario crear una red personalizada:

```bash
docker network create gestion-tareas-network
```

### 🚀 **Ejecutar los Contenedores**
Ejecuta los siguientes comandos para iniciar los contenedores y conectarlos a la red:

```bash
# Ejecutar Backend en la red
docker run -d --network gestion-tareas-network -p 8080:8080 --name backend-container gestion-tareas-backend

# Ejecutar Frontend en la red
docker run -d --network gestion-tareas-network -p 5173:5173 --name frontend-container gestion-tareas-frontend
```

### 🔍 **Verificar los Contenedores en Ejecución**
```bash
docker ps
```

Si necesitas ver los logs:
```bash
docker logs backend-container
docker logs frontend-container
```

### 🛑 **Detener y Eliminar Contenedores**
Si deseas detener los contenedores:
```bash
docker stop backend-container frontend-container
```
Para eliminarlos después de detenerlos:
```bash
docker rm backend-container frontend-container
```
Si deseas eliminar las imágenes:
```bash
docker rmi gestion-tareas-backend gestion-tareas-frontend
```

---

## 📄 **Documentación de la API**
FastAPI genera documentación automáticamente en:
- **Swagger:** [http://127.0.0.1:8080/docs](http://127.0.0.1:8080/docs)
- **Redoc:** [http://127.0.0.1:8080/redoc](http://127.0.0.1:8080/redoc)

---

## 📂 **Estructura del Proyecto**

### **Backend**
```
backend/
├── main.py              # Archivo principal de FastAPI
├── database.py          # Configuración de la base de datos
├── models/              # Modelos de la base de datos
│   ├── user.py
│   ├── task.py
│   ├── category.py
├── schemas/             # Esquemas de validación con Pydantic
│   ├── user.py
│   ├── task.py
│   ├── category.py
├── routes/              # Rutas para los endpoints
│   ├── user.py
│   ├── task.py
│   ├── category.py
├── config.py            # Variables de configuración
├── requirements.txt     # Dependencias del backend
├── Dockerfile           # Archivo para la imagen Docker del backend
├── .dockerignore        # Ignorar archivos en la imagen Docker
├── .gitignore           # Ignorar archivos en el repositorio Git
```

### **Frontend**
```
frontend/
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Navbar.jsx
│   │   ├── TaskList.jsx
│   │   ├── TaskForm.jsx
│   │   ├── CategoryList.jsx
│   ├── pages/              # Páginas principales
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Categories.jsx
│   │   ├── Profile.jsx
│   ├── context/            # Estado global
│   │   ├── AuthContext.jsx
│   ├── utils/              # Funciones auxiliares
│   │   ├── api.js
│   ├── styles/             # Estilos personalizados
│   │   ├── App.css
│   │   ├── index.css
│   ├── main.jsx            # Punto de entrada de la app
│   ├── App.jsx             # Enrutamiento principal
├── package.json          # Dependencias del frontend
├── Dockerfile            # Archivo para la imagen Docker del frontend
├── .dockerignore         # Ignorar archivos en la imagen Docker
├── .gitignore            # Ignorar archivos en el repositorio Git
```

---

## 🔗 **URL para acceder a la aplicación**

Una vez ejecutados los contenedores, accede a:
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **API Backend:** [http://localhost:8080](http://localhost:8080)

---

## 6️⃣ **Autores**
- **Desarrollador:** Jhon Mario Forero
- **Universidad:** Universidad de los Andes
- **Curso:** Desarrollo de Soluciones Cloud

 