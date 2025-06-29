# frontend/Dockerfile

# --- Etapa 1: Construcción ---
FROM node:22-alpine AS build

WORKDIR /usr/src/app

# Copiamos los archivos de configuración de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install --legacy-peer-deps

# Copiamos el código fuente
COPY . .

# Construye la aplicación para producción
RUN npm run build

# --- Etapa 2: Servidor ---
FROM nginx:alpine

# Copiamos la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos compilados de la aplicación desde la etapa de construcción
COPY --from=build /usr/src/app/dist/frontend /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

# Iniciamos nginx
CMD ["nginx", "-g", "daemon off;"]
    