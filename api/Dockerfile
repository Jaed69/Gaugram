# api/Dockerfile
# Usamos una imagen oficial de Node.js 22 LTS basada en Alpine (ligera)
FROM node:22-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código fuente de la aplicación
COPY . .

# Creamos un usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

# Cambiamos la propiedad de los archivos al usuario no-root
RUN chown -R nodeuser:nodejs /usr/src/app
USER nodeuser

# Exponemos el puerto 3000 que usa nuestra aplicación
EXPOSE 3000

# Comando de salud para Docker
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# El comando para iniciar la aplicación cuando el contenedor se ejecute
CMD [ "node", "src/index.js" ]
