# Imagen base de Node.js
FROM node:18

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos del frontend al contenedor
COPY . .

# Instalar dependencias
RUN npm install

# Construir la aplicación (si es necesario)
RUN npm run build

# Exponer el puerto de React
EXPOSE 5173

# Ejecutar la aplicación
CMD ["npm", "start"]