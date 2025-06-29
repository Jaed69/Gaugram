# frontend/Dockerfile

# --- Etapa 1: Construcción ---
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Construye la aplicación para producción
RUN npm run build

# --- Etapa 2: Servidor ---
FROM nginx:alpine

# Copiamos la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos compilados de la aplicación desde la etapa de construcción
COPY --from=build /usr/src/app/dist/frontend /usr/share/nginx/html

EXPOSE 80
    