# README - Aplicación de Gestión de Tareas

## Descripción
Esta aplicación permite la gestión de tareas personales con autenticación de usuarios, categorización de tareas y almacenamiento seguro.
La aplicación está dividida en dos partes:
1. **Backend:** Implementado con **FastAPI** y SQLite.
2. **Frontend:** Desarrollado con **React.js** y TailwindCSS para estilos.

---

## 1️⃣ **Backend**

### 📌 **Requisitos**
Antes de ejecutar el backend, asegúrate de tener instalado:
- Python 3.10 o superior
- `pip` y `virtualenv`
- `uvicorn` (para ejecutar FastAPI)
- `SQLite` (se usa por defecto en este proyecto)

## Instalación

Clona el repositorio:

   ```bash
   git clone https://github.com/mcforero95/ProyectoNivelacion.git
   cd ProyectoNivelacion

### 📦 **Instalación**
```bash
# Crear un entorno virtual (opcional pero recomendado)
python -m venv venv
source venv/bin/activate  # Para Mac/Linux
venv\Scripts\activate     # Para Windows

# Instalar dependencias
pip install -r requirements.txt
```

### 🚀 **Ejecutar el backend**
```bash
uvicorn main:app --reload
```
La API estará disponible en: [http://127.0.0.1:8080](http://127.0.0.1:8080)

### 📄 **Documentación de la API**
FastAPI genera documentación automáticamente en:
- **Swagger:** [http://127.0.0.1:8080/docs](http://127.0.0.1:8080/docs)
- **Redoc:** [http://127.0.0.1:8080/redoc](http://127.0.0.1:8080/redoc)

### 📂 **Estructura del backend**
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

---

## 2️⃣ **Frontend**

### 📌 **Requisitos**
Antes de ejecutar el frontend, asegúrate de tener instalado:
- Node.js 16+
- npm o yarn

### 📦 **Instalación**
```bash
# Instalar dependencias
cd frontend
npm install
```

### 🚀 **Ejecutar el frontend**
```bash
npm run dev
```
La aplicación estará disponible en: [http://localhost:5173](http://localhost:5173)

### 📂 **Estructura del frontend**
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

### 🔗 **Conexión con el Backend**
El archivo `src/utils/api.js` maneja la comunicación con el backend. Modifica la variable `API_BASE_URL` si el backend está desplegado en otro servidor.

---

## 3️⃣ **Archivos Docker**
### 🐳 **Dockerfile Backend**
```dockerfile
FROM python:3.10
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

### 🐳 **Dockerfile Frontend**
```dockerfile
FROM node:16
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
```

---

## 4️⃣ **Archivos de Ignorar**
### 📂 **.gitignore**
```plaintext
venv/
__pycache__/
node_modules/
dist/
build/
.env
db.sqlite3
```

### 📂 **.dockerignore**
```plaintext
venv/
__pycache__/
node_modules/
dist/
build/
.env
db.sqlite3
.git
```

---

## 5️⃣ **Autores**
- **Desarrollador:** Jhon Mario Forero
- **Universidad:** Universidad de los Andes
- **Curso:** Desarrollo de Soluciones Cloud