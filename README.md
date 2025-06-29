# Gaugram - Red Social

Una aplicación de red social moderna construida con Angular (frontend) y Node.js/Express (backend) con MongoDB como base de datos, totalmente containerizada con Docker.

## 🏗️ Estructura del Proyecto

```
Gaugram/
├── api/                    # Backend (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── index.js       # Servidor principal
│   │   └── models/
│   │       └── Post.js    # Modelo de datos para posts
│   ├── Dockerfile         # Configuración Docker para API
│   ├── package.json       # Dependencias del backend
│   └── package-lock.json
├── frontend/               # Frontend (Angular)
│   ├── src/
│   │   ├── app/
│   │   │   ├── services/
│   │   │   │   └── post.ts # Servicio HTTP para API
│   │   │   ├── app.component.ts
│   │   │   ├── app.component.html
│   │   │   └── app.component.css
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── Dockerfile         # Configuración Docker para Frontend
│   ├── nginx.conf         # Configuración del servidor web
│   ├── angular.json       # Configuración de Angular
│   ├── package.json       # Dependencias del frontend
│   └── package-lock.json
├── docker-compose.yml     # Orquestación de contenedores
├── .gitignore            # Archivos a ignorar en Git
└── README.md             # Este archivo
```

## 🚀 Tecnologías y Versiones

### **Frontend - Angular 20.0.0**
- **Framework**: Angular 20.0.0
- **Lenguaje**: TypeScript 5.8.2
- **HTTP Client**: RxJS 7.8.0
- **Herramientas de desarrollo**:
  - Angular CLI 20.0.0
  - Angular DevKit Build Angular 20.0.0
  - Karma 6.4.0 (testing)
  - Jasmine 5.7.0 (testing)

### **Backend - Node.js**
- **Runtime**: Node.js
- **Framework web**: Express 5.1.0
- **Base de datos**: MongoDB con Mongoose 8.16.0
- **CORS**: cors 2.8.5
- **Herramientas de desarrolllo**:
  - Nodemon 3.0.0 (auto-reload)

### **Base de Datos**
- **MongoDB**: Latest (mediante Docker)
- **ODM**: Mongoose 8.16.0

### **Containerización**
- **Docker**: Para containerización
- **Docker Compose**: version 3.8
- **Nginx**: Para servir el frontend en producción

### **Servidor Web**
- **Nginx**: Para servir archivos estáticos del frontend
- **Puerto**: 4200 (mapeado desde puerto 80 del contenedor)

## 📋 Requisitos Previos

- **Docker**: versión 20.10+
- **Docker Compose**: versión 1.29+
- **Git**: para clonar el repositorio

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/Jaed69/Gaugram.git
cd Gaugram
```

### 2. Ejecutar con Docker Compose (Recomendado)
```bash
# Construir y ejecutar todos los servicios
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d --build
```

### 3. Acceder a la aplicación
- **Frontend**: http://localhost:4200
- **API**: http://localhost:3000
- **MongoDB**: localhost:27017

### 4. Detener la aplicación
```bash
docker-compose down
```

## 🛠️ Desarrollo Local (Sin Docker)

### Backend
```bash
cd api
npm install
npm run dev    # Usar nodemon para auto-reload
# o
npm start      # Usar node directamente
```

### Frontend
```bash
cd frontend
npm install
npm start      # ng serve
# o
npm run build  # ng build para producción
```

## 📡 API Endpoints

| Método | Endpoint      | Descripción              |
|--------|---------------|--------------------------|
| GET    | /api/posts    | Obtener todos los posts  |
| POST   | /api/posts    | Crear un nuevo post      |

### Ejemplo de uso de la API:

**Crear un post:**
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"content": "Mi primer post!", "author": "Usuario"}'
```

**Obtener todos los posts:**
```bash
curl http://localhost:3000/api/posts
```

## ✨ Funcionalidades

- ✅ Crear posts de texto
- ✅ Ver todos los posts en tiempo real
- ✅ Interfaz responsive y moderna
- ✅ Persistencia de datos con MongoDB
- ✅ Arquitectura containerizada
- ✅ API RESTful
- ✅ Separación clara frontend/backend
- ✅ Configuración lista para producción

## 🐳 Contenedores Docker

### Servicios configurados:
1. **MongoDB** (`mongo:latest`)
   - Puerto: 27017
   - Volumen persistente: `mongo-data`

2. **API Backend** (Node.js + Express)
   - Puerto: 3000
   - Variables de entorno: `MONGO_URI=mongodb://mongo:27017/socialdb`

3. **Frontend** (Angular + Nginx)
   - Puerto: 4200 (mapeado desde 80)
   - Servido por Nginx para mejor rendimiento

## 🔧 Scripts Disponibles

### Backend (api/)
```bash
npm start      # Ejecutar servidor
npm run dev    # Ejecutar con nodemon (auto-reload)
npm test       # Ejecutar tests (configurar)
```

### Frontend (frontend/)
```bash
npm start      # ng serve - servidor de desarrollo
npm run build  # ng build - compilar para producción
npm test       # ng test - ejecutar tests unitarios
npm run watch  # ng build --watch - compilar en modo watch
```

## 📊 Modelo de Datos

### Post
```javascript
{
  _id: ObjectId,          // MongoDB ObjectId
  content: String,        // Contenido del post
  author: String,         // Autor del post (opcional)
  createdAt: Date         // Fecha de creación
}
```

## 🔗 Variables de Entorno

### Backend
- `MONGO_URI`: URI de conexión a MongoDB (default: `mongodb://mongo:27017/socialdb`)
- `PORT`: Puerto del servidor (default: 3000)

### Frontend
- La URL de la API está configurada en `src/app/services/post.ts`

## 🚦 Estados de los Puertos

| Servicio | Puerto Host | Puerto Contenedor | Descripción |
|----------|-------------|-------------------|-------------|
| Frontend | 4200        | 80                | Aplicación Angular |
| API      | 3000        | 3000              | Backend Express |
| MongoDB  | 27017       | 27017             | Base de datos |

## 📝 Notas Importantes

- La aplicación está completamente dockerizada para facilitar el despliegue
- Los datos de MongoDB se persisten en un volumen de Docker named `mongo-data`
- El frontend se sirve a través de Nginx para mejor rendimiento en producción
- Las dependencias están definidas en los archivos `package.json` respectivos
- Se incluye `.gitignore` para evitar subir `node_modules` y archivos temporales

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

- **Jaed69** - [@Jaed69](https://github.com/Jaed69) 