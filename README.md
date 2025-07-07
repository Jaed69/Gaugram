# Gaugram - Red Social Completa

Una aplicación completa de red social estilo Instagram construida con React, Node.js/Express, y MongoDB, todo ejecutándose en contenedores Docker.

## Características

- **Frontend**: React con Material-UI para una interfaz moderna
- **Backend**: Node.js/Express API REST con carga de archivos
- **Base de datos**: MongoDB para almacenamiento de datos
- **Autenticación**: JWT tokens
- **Almacenamiento**: Sistema de carga y procesamiento de imágenes
- **Contenedores**: Docker y Docker Compose

## Funcionalidades

### ✅ Sistema de Usuarios
- Registro e inicio de sesión
- Perfiles completos con biografía
- Imágenes de perfil personalizables
- Sistema de verificación y privacidad

### ✅ Sistema de Posts
- Creación de posts con imágenes
- Captions con extracción automática de hashtags
- Ubicación geográfica
- Feed personalizado
- Explorar posts populares

### ✅ Interacciones Sociales
- Sistema de likes en posts
- Comentarios anidados (respuestas)
- Seguir/dejar de seguir usuarios
- Sistema de notificaciones

### ✅ Manejo de Imágenes
- Carga de imágenes mediante drag & drop
- Procesamiento automático con Sharp
- Redimensionado y optimización
- Vista previa antes de publicar

### ✅ Diseño y UX
- Interfaz responsive
- Tema Material Design
- Steppers para crear posts
- Componentes reutilizables

## Arquitectura

```
├── frontend/          # React Application (Puerto 3000)
├── backend/           # Node.js/Express API (Puerto 3001)
├── mongo-init/        # Scripts de inicialización de MongoDB
└── docker-compose.yml # Configuración de contenedores
```

## Requisitos Previos

- Docker Desktop instalado
- Docker Compose

## Instalación y Ejecución

1. **Clonar el repositorio y navegar al directorio:**
   ```bash
   cd "Nueva carpeta"
   ```

2. **Construir y ejecutar los contenedores:**
   ```bash
   docker-compose up --build
   ```

3. **Acceder a la aplicación:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MongoDB: localhost:27017

## Servicios

### Frontend (React)
- **Puerto**: 3000
- **Características**: 
  - Interfaz moderna con Material-UI
  - Navegación con React Router
  - Gestión de estado con Context API
  - Responsive design

### Backend (Node.js/Express)
- **Puerto**: 3001
- **Endpoints principales**:
  - `POST /api/auth/register` - Registro de usuarios
  - `POST /api/auth/login` - Inicio de sesión
  - `GET /api/posts` - Obtener posts
  - `POST /api/posts` - Crear post
  - `POST /api/posts/:id/like` - Like/Unlike post
  - `GET /api/users/profile` - Perfil de usuario

### Base de Datos (MongoDB)
- **Puerto**: 27017
- **Base de datos**: socialnetwork
- **Colecciones**: users, posts

## Uso de la Aplicación

1. **Registro**: Crear una nueva cuenta con email, username y datos personales
2. **Login**: Iniciar sesión con email y contraseña
3. **Crear Posts**: Compartir pensamientos y contenido
4. **Interactuar**: Dar like a posts de otros usuarios
5. **Perfil**: Ver información personal y estadísticas

## Desarrollo

Para desarrollo local con hot reload:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start
```

## Comandos Útiles

```bash
# Ver logs de los contenedores
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Parar y eliminar contenedores
docker-compose down

# Reconstruir contenedores
docker-compose up --build --force-recreate
```

## Estructura de Datos

### Usuario
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  firstName: String,
  lastName: String,
  bio: String,
  followers: [ObjectId],
  following: [ObjectId]
}
```

### Post
```javascript
{
  content: String,
  author: ObjectId,
  likes: [{ user: ObjectId, createdAt: Date }],
  comments: [{ content: String, author: ObjectId, createdAt: Date }],
  createdAt: Date
}
```

## Características Técnicas

- **Seguridad**: Contraseñas hasheadas con bcrypt, JWT para autenticación
- **Validación**: Express Validator para validación de datos
- **CORS**: Configurado para comunicación frontend-backend
- **Health Checks**: Endpoints de salud para monitoreo
- **Error Handling**: Manejo centralizado de errores

## Próximas Mejoras

- [ ] Sistema de comentarios completo
- [ ] Carga de imágenes
- [ ] Chat en tiempo real
- [ ] Notificaciones
- [ ] Búsqueda de usuarios
- [ ] Feed personalizado

## Troubleshooting

Si tienes problemas:

1. Verifica que Docker Desktop esté ejecutándose
2. Asegúrate de que los puertos 3000, 3001 y 27017 estén disponibles
3. Elimina contenedores antiguos: `docker-compose down`
4. Reconstruye las imágenes: `docker-compose up --build`
