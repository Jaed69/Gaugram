# Mi Red Social

Una aplicación de red social simple construida con Angular (frontend) y Node.js/Express (backend) con MongoDB como base de datos.

## Estructura del Proyecto

```
mi-red-social/
├── api/                 # Backend (Node.js + Express)
├── frontend/           # Frontend (Angular)
└── docker-compose.yml  # Configuración de Docker
```

## Tecnologías Utilizadas

- **Frontend**: Angular 17
- **Backend**: Node.js, Express
- **Base de Datos**: MongoDB
- **Contenedores**: Docker & Docker Compose

## Requisitos Previos

- Docker
- Docker Compose

## Cómo Ejecutar la Aplicación

1. **Clonar el repositorio** (si no lo has hecho ya):
   ```bash
   git clone <tu-repositorio>
   cd mi-red-social
   ```

2. **Ejecutar con Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Acceder a la aplicación**:
   - Frontend: http://localhost:4200
   - API: http://localhost:3000
   - MongoDB: localhost:27017

## Funcionalidades

- ✅ Crear posts
- ✅ Ver todos los posts
- ✅ Interfaz responsive
- ✅ Persistencia de datos con MongoDB

## Desarrollo Local

Si prefieres desarrollar sin Docker:

### Backend
```bash
cd api
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Estructura de la API

- `GET /api/posts` - Obtener todos los posts
- `POST /api/posts` - Crear un nuevo post

## Notas Importantes

- La aplicación está configurada para funcionar completamente con Docker
- Los datos de MongoDB se persisten en un volumen de Docker
- El frontend se sirve a través de Nginx para mejor rendimiento 