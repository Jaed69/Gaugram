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

# Exponemos el puerto 3000 que usa nuestra aplicación
EXPOSE 3000

# El comando para iniciar la aplicación cuando el contenedor se ejecute
CMD [ "node", "src/index.js" ]
