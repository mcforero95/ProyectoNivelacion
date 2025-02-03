# Usar una versión estable de Node.js
FROM node:20

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos del frontend al contenedor
COPY . .

# Configurar NPM para asegurarse de que usa el registro correcto y eliminar autenticación previa
RUN npm config set registry https://registry.npmjs.org/ \
    && npm config delete //registry.npmjs.org/:_authToken \
    && npm cache clean --force \
    && rm -rf ~/.npmrc

# Instalar dependencias sin autenticación
RUN npm install 
# Construir la aplicación
RUN npm run build

# Exponer el puerto del frontend
EXPOSE 5173

# Comando para iniciar el frontend
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
