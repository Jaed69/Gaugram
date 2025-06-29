# 📸 Gaugram - Red Social Estilo Instagram

![Gaugram Logo](https://img.shields.io/badge/Gaugram-Social%20Media-ff69b4?style=for-the-badge&logo=instagram)
![Status](https://img.shields.io/badge/Status-Completado-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![Angular](https://img.shields.io/badge/Angular-20.0.0-DD0031?style=for-the-badge&logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-22.17.0-339933?style=for-the-badge&logo=node.js)

## 🌟 Descripción

**Gaugram** es una aplicación web de red social moderna que replica la experiencia de Instagram. Desarrollada con tecnologías de vanguardia, ofrece una interfaz elegante y funcionalidades completas para compartir momentos, interactuar con otros usuarios y crear una comunidad vibrante.

### ✨ Características Principales

- 🎨 **UI/UX Tipo Instagram**: Diseño moderno y responsivo idéntico a Instagram
- 📱 **Responsive Design**: Optimizado para dispositivos móviles y desktop
- 🔐 **Autenticación Segura**: Sistema JWT con guards y interceptors
- 📸 **Feed Interactivo**: Posts con likes, comentarios y compartir
- 👤 **Perfiles de Usuario**: Gestión completa de perfiles y seguidores
- 🔍 **Búsqueda Avanzada**: Buscar usuarios y contenido
- 🌙 **Navegación Moderna**: Header y bottom navigation como Instagram
- ⚡ **Tiempo Real**: Actualizaciones inmediatas de interacciones
- 🐳 **Dockerizado**: Fácil despliegue con Docker Compose

## 🛠️ Stack Tecnológico Completo

### 🎯 Frontend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Angular** | `20.0.0` | Framework principal con componentes standalone |
| **TypeScript** | `5.8.2` | Lenguaje de programación tipado |
| **RxJS** | `7.8.0` | Programación reactiva y observables |
| **Angular CLI** | `20.0.0` | Herramientas de desarrollo |
| **Zone.js** | `0.15.0` | Detección de cambios automática |

#### 📦 Dependencias Frontend
```json
{
  "@angular/animations": "^20.0.0",
  "@angular/common": "^20.0.0",
  "@angular/compiler": "^20.0.0",
  "@angular/core": "^20.0.0",
  "@angular/forms": "^20.0.0",
  "@angular/platform-browser": "^20.0.0",
  "@angular/platform-browser-dynamic": "^20.0.0",
  "@angular/router": "^20.0.0",
  "@angular/cli": "^20.0.0",
  "rxjs": "~7.8.0",
  "tslib": "^2.3.0",
  "zone.js": "~0.15.0"
}
```

#### 🔧 DevDependencies Frontend
```json
{
  "@angular-devkit/build-angular": "^20.0.0",
  "@angular/compiler-cli": "^20.0.0",
  "@types/jasmine": "~5.1.0",
  "@types/node": "^20.17.19",
  "jasmine-core": "~5.7.0",
  "karma": "~6.4.0",
  "karma-chrome-launcher": "~3.2.0",
  "karma-coverage": "~2.2.0",
  "karma-jasmine": "~5.1.0",
  "karma-jasmine-html-reporter": "~2.1.0",
  "typescript": "~5.8.2"
}
```

### ⚡ Backend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Node.js** | `22.17.0` | Runtime de JavaScript |
| **Express** | `4.18.2` | Framework web minimalista |
| **MongoDB** | `8.16.0` | Base de datos NoSQL |
| **Mongoose** | `8.16.0` | ODM para MongoDB |
| **JWT** | `9.0.2` | Autenticación por tokens |
| **bcryptjs** | `2.4.3` | Encriptación de contraseñas |

#### 📦 Dependencias Backend
```json
{
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.16.0",
  "multer": "^1.4.5-lts.1",
  "cloudinary": "^1.41.3",
  "express-rate-limit": "^6.10.0",
  "helmet": "^7.1.0",
  "express-validator": "^6.15.0"
}
```

#### 🔧 DevDependencies Backend
```json
{
  "nodemon": "^3.0.0"
}
```

### 🐳 Infraestructura
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Docker** | `latest` | Containerización |
| **Docker Compose** | `v2` | Orquestación de contenedores |
| **MongoDB** | `7.0` | Base de datos en contenedor |
| **Node Alpine** | `22-alpine` | Imagen base ligera |

## 🚀 Instalación y Configuración

### 📋 Prerrequisitos

- **Node.js** ≥ 22.17.0
- **npm** ≥ 10.0.0
- **Docker** ≥ 24.0.0
- **Docker Compose** ≥ 2.0.0
- **Git** ≥ 2.40.0

### 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Jaed69/Gaugram.git
cd Gaugram
```

2. **Verificar estructura del proyecto**
```
Gaugram/
├── api/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.js
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── package.json
├── frontend/               # Frontend (Angular 20)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── core/
│   │   ├── assets/
│   │   └── index.html
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── angular.json
│   └── package.json
├── docker-compose.yml      # Producción
├── docker-compose.dev.yml  # Desarrollo
└── README.md
```

### 🚀 Desarrollo (Recomendado)

**Opción 1: Con Docker (Recomendado)**
```bash
# Iniciar todos los servicios en desarrollo
docker-compose -f docker-compose.dev.yml up --build

# Ver logs en tiempo real
docker-compose -f docker-compose.dev.yml logs -f

# Detener servicios
docker-compose -f docker-compose.dev.yml down
```

**Opción 2: Instalación Local**
```bash
# Backend
cd api
npm install
npm run dev

# Frontend (nueva terminal)
cd frontend
npm install
npm start
```

### 🏭 Producción

```bash
# Construir y ejecutar en producción
docker-compose up --build -d

# Ver estado de servicios
docker-compose ps

# Ver logs
docker-compose logs -f
```

## 🌐 URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:4200 | Aplicación web principal |
| **Backend API** | http://localhost:3000 | API REST |
| **MongoDB** | mongodb://localhost:27017 | Base de datos |

## 📱 Funcionalidades Implementadas

### 🎨 Frontend (Angular 20)
- ✅ **Componentes Standalone**: Arquitectura moderna de Angular 20
- ✅ **Feed Interactivo**: Posts con like, comentarios, compartir
- ✅ **Autenticación**: Login/Register con validación en tiempo real
- ✅ **Navegación**: Header con búsqueda y bottom navigation
- ✅ **Perfiles**: Gestión completa de perfiles de usuario
- ✅ **Responsive**: Diseño adaptativo para móvil y desktop
- ✅ **Guards**: Protección de rutas con authentication guards
- ✅ **Interceptors**: Manejo automático de tokens JWT
- ✅ **Lazy Loading**: Carga diferida de componentes

### ⚡ Backend (Node.js + Express)
- ✅ **API RESTful**: Endpoints completos para todas las funcionalidades
- ✅ **Autenticación JWT**: Tokens seguros con refresh tokens
- ✅ **Middlewares**: Rate limiting, CORS, Helmet para seguridad
- ✅ **Validación**: Express-validator para datos de entrada
- ✅ **Upload de imágenes**: Multer + Cloudinary para gestión de medios
- ✅ **Encriptación**: bcryptjs para contraseñas seguras
- ✅ **Base de datos**: MongoDB con Mongoose ODM

### 🗄️ Base de Datos (MongoDB)
- ✅ **Modelos**: User, Post, Comment, Like
- ✅ **Relaciones**: Referencias entre documentos
- ✅ **Índices**: Optimización de consultas
- ✅ **Validaciones**: Esquemas con validación de datos

## 📖 Documentación de API

### 🔐 Autenticación
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
GET  /api/auth/me
```

### 👤 Usuarios
```http
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
POST   /api/users/:id/follow
DELETE /api/users/:id/unfollow
```

### 📸 Posts
```http
GET    /api/posts/feed
GET    /api/posts/:id
POST   /api/posts
PUT    /api/posts/:id
DELETE /api/posts/:id
POST   /api/posts/:id/like
DELETE /api/posts/:id/unlike
```

### 💬 Comentarios
```http
GET    /api/comments/post/:postId
POST   /api/comments
PUT    /api/comments/:id
DELETE /api/comments/:id
```

### 📄 Ejemplo de Respuesta
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "profileImage": "https://example.com/avatar.jpg",
      "followersCount": 150,
      "followingCount": 89,
      "postsCount": 42
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🔧 Configuración Avanzada

### 🔐 Variables de Entorno

**Backend (.env)**
```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://mongo:27017/gaugram
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CORS_ORIGIN=http://localhost:4200
```

**Frontend (environment.ts)**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  socketUrl: 'http://localhost:3000'
};
```

### 🐳 Docker Compose Configuración

**Desarrollo (docker-compose.dev.yml)**
```yaml
services:
  mongo:
    image: mongo:7.0
    ports:
      - "27017:27017"
  
  api:
    build:
      context: ./api
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./api/src:/usr/src/app/src:ro
  
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "4200:4200"
    volumes:
      - ./frontend/src:/usr/src/app/src:ro
```

## 🛠️ Comandos Útiles

### 🐳 Docker
```bash
# Reconstruir servicios específicos
docker-compose -f docker-compose.dev.yml up --build frontend
docker-compose -f docker-compose.dev.yml up --build api

# Ver logs de servicio específico
docker-compose -f docker-compose.dev.yml logs -f frontend
docker-compose -f docker-compose.dev.yml logs -f api

# Ejecutar comandos dentro de contenedores
docker exec -it gaugram_api_dev npm install
docker exec -it gaugram_frontend_dev ng generate component example
```

### 🔍 Debugging
```bash
# Verificar estado de contenedores
docker-compose -f docker-compose.dev.yml ps

# Inspeccionar redes
docker network ls
docker network inspect gaugram_gaugram-network-dev

# Limpiar contenedores y volúmenes
docker-compose -f docker-compose.dev.yml down --volumes
docker system prune -a
```

## 🧪 Testing

### 🔬 Backend Testing
```bash
cd api
npm test
npm run test:coverage
```

### 🧪 Frontend Testing
```bash
cd frontend
npm test
npm run test:watch
npm run e2e
```

## 🚀 Despliegue

### 🌐 Producción con Docker
```bash
# Construir para producción
docker-compose build

# Ejecutar en producción
docker-compose up -d

# Verificar servicios
docker-compose ps
```

### ☁️ Despliegue en la Nube
- **Frontend**: Vercel, Netlify, Firebase Hosting
- **Backend**: Railway, Render, DigitalOcean
- **Base de datos**: MongoDB Atlas, Railway PostgreSQL

## 🔧 Solución de Problemas

### ❌ Problemas Comunes

**Error: EADDRINUSE :::4200**
```bash
# Liberar puerto 4200
npx kill-port 4200
# o cambiar puerto en angular.json
ng serve --port 4201
```

**Error: Cannot connect to MongoDB**
```bash
# Verificar que MongoDB esté ejecutándose
docker-compose -f docker-compose.dev.yml logs mongo
# Reiniciar servicio de MongoDB
docker-compose -f docker-compose.dev.yml restart mongo
```

**Error: Module not found**
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

**Error de compilación Angular**
```bash
# Limpiar caché de Angular
ng cache clean
# Reconstruir proyecto
ng build --configuration development
```

### 🐛 Logs Útiles
```bash
# Ver todos los logs
docker-compose -f docker-compose.dev.yml logs

# Logs específicos con filtro
docker-compose -f docker-compose.dev.yml logs frontend | grep ERROR
docker-compose -f docker-compose.dev.yml logs api | grep "listening"
```

## 📈 Rendimiento y Optimización

### ⚡ Frontend
- **Lazy Loading**: Módulos cargados bajo demanda
- **OnPush Strategy**: Optimización de detección de cambios
- **Bundle Optimization**: Tree shaking y code splitting
- **Image Optimization**: Lazy loading de imágenes

### 🚀 Backend
- **Rate Limiting**: 100 requests/15min por IP
- **Compression**: Gzip habilitado
- **Helmet**: Headers de seguridad
- **MongoDB Indices**: Consultas optimizadas

## 🎯 Próximas Funcionalidades

- [ ] 📱 **Stories**: Historias temporales
- [ ] 💬 **Chat en tiempo real**: Mensajes directos
- [ ] 🔔 **Notificaciones push**: Avisos en tiempo real
- [ ] 🌍 **Geolocalización**: Posts con ubicación
- [ ] 🎥 **Videos**: Soporte para contenido multimedia
- [ ] 🔍 **Búsqueda avanzada**: Filtros y hashtags
- [ ] 📊 **Analytics**: Estadísticas de posts
- [ ] 🎨 **Temas**: Modo oscuro/claro

## 👥 Contribuir

### 🤝 Cómo Contribuir
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### 📝 Estándares de Código
- **Angular**: Seguir Angular Style Guide
- **TypeScript**: Strict mode habilitado
- **Prettier**: Formateo automático de código
- **ESLint**: Linting para JavaScript/TypeScript

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@Jaed69](https://github.com/Jaed69)
- LinkedIn: [Tu LinkedIn](https://linkedin.com/in/tu-perfil)
- Email: tu.email@ejemplo.com

## 🙏 Agradecimientos

- **Angular Team** por el excelente framework
- **Express.js** por la simplicidad del backend
- **MongoDB** por la flexibilidad de la base de datos
- **Docker** por facilitar el despliegue
- **Instagram** por la inspiración del diseño

---

<div align="center">

### ⭐ Si te gusta este proyecto, ¡dale una estrella!

**Hecho con ❤️ por [@Jaed69](https://github.com/Jaed69)**

![Gaugram](https://img.shields.io/badge/Gaugram-2024-ff69b4?style=for-the-badge)

</div>
