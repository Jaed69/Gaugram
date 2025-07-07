# Gaugram - Red Social Completa

Una aplicación completa de red social estilo Instagram construida con React, Node.js/Express, y MongoDB, todo ejecutándose en contenedores Docker.

## 🚀 Características

- **Frontend**: React 18 con Material-UI 5 para una interfaz moderna
- **Backend**: Node.js/Express API REST con carga de archivos
- **Base de datos**: MongoDB para almacenamiento de datos
- **Autenticación**: JWT tokens con middleware de seguridad
- **Procesamiento de imágenes**: Sharp para redimensionado y optimización
- **Contenedores**: Docker y Docker Compose para desarrollo y producción

## 📱 Funcionalidades Implementadas

### ✅ Sistema de Usuarios Completo
- Registro e inicio de sesión con validación
- Perfiles completos con biografía editable
- Imágenes de perfil personalizables con procesamiento automático
- Sistema de seguimiento (seguir/dejar de seguir)
- Contadores de seguidores y siguiendo
- Verificación de usuarios
- Gestión de privacidad

### ✅ Sistema de Posts Avanzado
- **Posts con imágenes**: Carga mediante drag & drop con vista previa
- **Posts de solo texto**: Publicación de pensamientos sin imagen
- **Captions**: Descripción de posts con límite de caracteres
- **Hashtags**: Extracción automática de hashtags
- **Ubicación**: Geolocalización opcional
- **Feed personalizado**: Ordenado por fecha de creación
- **Contadores**: Likes y comentarios en tiempo real

### ✅ Interacciones Sociales
- **Sistema de likes**: Like/Unlike en posts
- **Comentarios**: Sistema de comentarios con autor y fecha
- **Seguimiento**: Botón de seguir/siguiendo con estados visuales
- **Notificaciones**: Feedback visual para todas las acciones

### ✅ Carga y Procesamiento de Imágenes
- **Drag & Drop**: Interfaz intuitiva para subir imágenes
- **Múltiples formatos**: Soporte para JPG, PNG, GIF, WebP
- **Procesamiento automático**: Redimensionado con Sharp
- **Optimización**: Compresión automática para mejor rendimiento
- **Límites de tamaño**: Máximo 10MB por imagen
- **Almacenamiento organizado**: Separación por tipo (posts/perfiles)

### ✅ Diseño y UX Profesional
- **Responsive design**: Adaptado a todas las pantallas
- **Material Design**: Componentes consistentes y modernos
- **Tema personalizable**: Soporte para temas claro/oscuro
- **Steppers**: Proceso guiado para crear posts
- **Loading states**: Indicadores de carga para mejor UX
- **Error handling**: Manejo elegante de errores

## 🏗️ Arquitectura Técnica

```
gaugram/
├── frontend/                 # React Application (Puerto 3000)
│   ├── public/
│   └── src/
│       ├── components/       # Componentes reutilizables
│       ├── context/         # Context API para estado global
│       ├── pages/           # Páginas principales
│       └── App.js           # Componente principal
├── backend/                 # Node.js/Express API (Puerto 3001)
│   ├── middleware/          # Autenticación y upload
│   ├── models/             # Modelos de MongoDB
│   ├── routes/             # Rutas de la API
│   └── server.js           # Servidor principal
├── mongo-init/             # Scripts de inicialización DB
├── uploads/                # Almacenamiento de imágenes
└── docker-compose.yml      # Configuración de contenedores
```

## 🛠️ Stack Tecnológico

### Frontend
- **React 18**: Biblioteca principal con hooks
- **Material-UI 5**: Componentes de interfaz
- **React Router 6**: Navegación SPA
- **Axios**: Cliente HTTP
- **React Dropzone**: Carga de archivos
- **Context API**: Gestión de estado global

### Backend
- **Node.js**: Runtime de JavaScript
- **Express**: Framework web
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **Sharp**: Procesamiento de imágenes
- **Multer**: Middleware para archivos
- **JWT**: Autenticación tokenizada
- **Bcrypt**: Hashing de contraseñas
- **Helmet**: Seguridad HTTP
- **Morgan**: Logging de requests

### DevOps
- **Docker**: Contenedores
- **Docker Compose**: Orquestación
- **Health checks**: Monitoreo de servicios
- **Volumes**: Persistencia de datos

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Docker Desktop
- Git

### Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Jaed69/Gaugram.git
   cd Gaugram
   ```

2. **Construir y ejecutar los contenedores:**
   ```bash
   docker-compose up --build
   ```

3. **Acceder a la aplicación:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MongoDB: localhost:27017

## 📋 Servicios

### Frontend React (Puerto 3000)
- **Tecnologías**: React 18, Material-UI 5, React Router 6
- **Características**: 
  - Interfaz responsive moderna
  - Componentes reutilizables
  - Estado global con Context API
  - Navegación SPA fluida
  - Carga optimizada de imágenes

### Backend API (Puerto 3001)
- **Tecnologías**: Node.js, Express, MongoDB
- **Endpoints principales**:
  - `POST /api/auth/register` - Registro de usuarios
  - `POST /api/auth/login` - Inicio de sesión
  - `GET /api/posts` - Feed de posts con paginación
  - `POST /api/posts` - Crear post (imagen o texto)
  - `POST /api/posts/:id/like` - Like/Unlike post
  - `POST /api/posts/:id/comment` - Comentar post
  - `GET /api/users/profile` - Perfil del usuario
  - `PUT /api/users/profile` - Actualizar perfil
  - `POST /api/users/:id/follow` - Seguir/dejar de seguir
  - `POST /api/upload/profile` - Subir imagen de perfil
  - `POST /api/upload/post` - Subir imagen de post

### Base de Datos MongoDB (Puerto 27017)
- **Base de datos**: socialnetwork
- **Colecciones**: users, posts
- **Características**: 
  - Índices optimizados
  - Validaciones de esquema
  - Referencias pobladas
  - Soft deletes

## 💻 Desarrollo Local

Para desarrollo con hot reload:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (nueva terminal)
cd frontend
npm install
npm start
```

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Obtener usuario actual

### Posts
- `GET /api/posts` - Lista de posts (feed)
- `GET /api/posts/user/:userId` - Posts de un usuario
- `POST /api/posts` - Crear post
- `PUT /api/posts/:id` - Actualizar post
- `DELETE /api/posts/:id` - Eliminar post
- `POST /api/posts/:id/like` - Like/Unlike
- `POST /api/posts/:id/comment` - Añadir comentario

### Usuarios
- `GET /api/users/profile` - Perfil actual
- `PUT /api/users/profile` - Actualizar perfil
- `POST /api/users/:id/follow` - Seguir usuario
- `GET /api/users/:id/followers` - Lista de seguidores
- `GET /api/users/:id/following` - Lista de seguidos

### Uploads
- `POST /api/upload/profile` - Subir imagen de perfil
- `POST /api/upload/post` - Subir imagen de post

## 🗄️ Modelos de Datos

### Usuario
```javascript
{
  username: String,        // Único, 3-30 caracteres
  email: String,          // Único, validado
  password: String,       // Hasheado con bcrypt
  firstName: String,      // Nombre
  lastName: String,       // Apellido
  fullName: String,       // Nombre completo
  bio: String,           // Biografía (150 caracteres)
  profileImage: String,   // URL de imagen de perfil
  isVerified: Boolean,    // Estado de verificación
  isPrivate: Boolean,     // Cuenta privada
  followers: [ObjectId],  // Referencias a usuarios
  following: [ObjectId],  // Referencias a usuarios
  postsCount: Number,     // Contador de posts
  followersCount: Number, // Contador de seguidores
  followingCount: Number  // Contador de seguidos
}
```

### Post
```javascript
{
  userId: ObjectId,       // Referencia al autor
  imageUrl: String,       // URL de imagen (opcional)
  content: String,        // Contenido del post (2200 caracteres)
  caption: String,        // Descripción (500 caracteres)
  hashtags: [String],     // Hashtags extraídos
  location: String,       // Ubicación (100 caracteres)
  likes: [ObjectId],      // Referencias a usuarios
  comments: [{
    content: String,      // Contenido del comentario
    author: ObjectId,     // Referencia al autor
    createdAt: Date       // Fecha de creación
  }],
  likesCount: Number,     // Contador de likes
  commentsCount: Number,  // Contador de comentarios
  isActive: Boolean,      // Soft delete
  createdAt: Date,        // Fecha de creación
  updatedAt: Date         // Fecha de actualización
}
```

## 🔧 Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Parar contenedores
docker-compose down

# Limpiar y reconstruir
docker-compose down
docker-compose up --build --force-recreate

# Acceder a MongoDB
docker exec -it social_db mongosh socialnetwork

# Ver estado de contenedores
docker ps

# Limpiar imágenes no utilizadas
docker system prune -a
```

## 🔒 Características de Seguridad

- **Autenticación JWT**: Tokens seguros con expiración
- **Bcrypt**: Hashing de contraseñas con salt
- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configuración de origen cruzado
- **Validación**: Express Validator para entrada de datos
- **Rate limiting**: Límites de subida de archivos
- **Sanitización**: Limpieza de datos de entrada

## 📊 Optimizaciones de Rendimiento

- **Paginación**: Carga incremental de posts
- **Lazy loading**: Carga diferida de imágenes
- **Compresión**: Imágenes optimizadas con Sharp
- **Índices**: Base de datos optimizada
- **Caching**: Headers de cache para recursos estáticos
- **Minificación**: Archivos optimizados en producción

## 🛠️ Troubleshooting

### Problemas Comunes

1. **Contenedores no inician**
   ```bash
   # Verificar Docker Desktop
   docker --version
   
   # Limpiar contenedores
   docker-compose down
   docker system prune -a
   ```

2. **Puertos ocupados**
   ```bash
   # Verificar puertos
   netstat -an | findstr :3000
   netstat -an | findstr :3001
   netstat -an | findstr :27017
   ```

3. **Problemas de base de datos**
   ```bash
   # Reiniciar MongoDB
   docker-compose restart mongo
   
   # Verificar conexión
   docker exec -it social_db mongosh --eval "db.adminCommand('ping')"
   ```

4. **Imágenes no cargan**
   - Verificar permisos de la carpeta `uploads/`
   - Comprobar límites de tamaño (10MB max)
   - Verificar formatos soportados (JPG, PNG, GIF, WebP)

## 📈 Métricas del Proyecto

- **Líneas de código**: ~5,000+
- **Componentes React**: 15+
- **Endpoints API**: 20+
- **Modelos de datos**: 2
- **Middleware**: 3
- **Tiempo de build**: ~2 minutos
- **Tiempo de inicio**: ~30 segundos

## 🎯 Roadmap Futuro

### Próximas Características
- [ ] Sistema de notificaciones en tiempo real
- [ ] Chat privado entre usuarios
- [ ] Historias temporales (Stories)
- [ ] Búsqueda avanzada de usuarios y hashtags
- [ ] Feed algorítmico personalizado
- [ ] Integración con redes sociales
- [ ] API para aplicaciones móviles
- [ ] Analytics y métricas
- [ ] Moderación de contenido
- [ ] Monetización y publicidad

### Mejoras Técnicas
- [ ] Tests unitarios y de integración
- [ ] CI/CD con GitHub Actions
- [ ] Monitoreo con Prometheus
- [ ] Logging estructurado
- [ ] Backup automático de base de datos
- [ ] CDN para imágenes
- [ ] Microservicios
- [ ] GraphQL API

## 👥 Contribución

1. Fork el repositorio
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Agradecimientos

- Material-UI por los componentes hermosos
- Sharp por el procesamiento de imágenes
- MongoDB por la base de datos flexible
- Docker por la containerización
- React por la interfaz de usuario reactiva

---

**Desarrollado con ❤️ usando React, Node.js, y MongoDB**

🌟 **¡Dale una estrella al repositorio si te gustó el proyecto!**
