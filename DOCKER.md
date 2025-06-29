# 🐳 Guía de Despliegue con Docker

## Prerrequisitos
- Docker Desktop instalado
- Docker Compose v2.0+

## Configuración Rápida

### 1. Clonar el repositorio
```bash
git clone https://github.com/Jaed69/Gaugram.git
cd Gaugram
```

### 2. Iniciar los servicios
```bash
# Iniciar todos los servicios
docker-compose up -d

# O paso a paso (recomendado para debug)
docker-compose up mongo -d
docker-compose up api -d
docker-compose up frontend -d
```

### 3. Verificar servicios
```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs
docker-compose logs -f
```

### 4. Acceder a la aplicación
- **Frontend**: http://localhost:4200
- **API**: http://localhost:3000/api/health
- **MongoDB**: mongodb://localhost:27017/gaugram

## Comandos Útiles

### Desarrollo
```bash
# Rebuild sin caché
docker-compose build --no-cache

# Reiniciar un servicio
docker-compose restart api

# Ver logs en tiempo real
docker-compose logs -f api
```

### Mantenimiento
```bash
# Detener servicios
docker-compose down

# Limpiar todo (incluyendo volúmenes)
docker-compose down --volumes --rmi all

# Backup de la base de datos
docker exec gaugram_mongo mongodump --db gaugram --out /backup
```

## Solución de Problemas

### Si la API no responde:
```bash
# Verificar logs
docker-compose logs api

# Reiniciar API
docker-compose restart api

# Verificar conectividad a MongoDB
docker exec gaugram_api ping mongo
```

### Si hay errores de dependencias:
```bash
# Rebuild completo
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Estructura de Archivos Docker

```
Gaugram/
├── docker-compose.yml           # Configuración principal
├── docker-compose.dev.yml       # Configuración para desarrollo
├── docker-scripts.sh/.bat       # Scripts de utilidad
├── api/
│   ├── Dockerfile              # Imagen de producción
│   ├── Dockerfile.dev          # Imagen de desarrollo
│   ├── .dockerignore           # Archivos a ignorar
│   └── .env                    # Variables de entorno
├── frontend/
│   ├── Dockerfile              # Imagen de producción
│   ├── Dockerfile.dev          # Imagen de desarrollo
│   ├── nginx.conf              # Configuración Nginx
│   └── .dockerignore           # Archivos a ignorar
└── mongo-init/
    └── init-mongo.js           # Script de inicialización DB
```

## Variables de Entorno

### API (.env)
```env
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb://mongo:27017/gaugram
JWT_SECRET=tu-clave-secreta-jwt
CORS_ORIGIN=http://localhost:4200
```

### Frontend (environments/)
```typescript
export const environment = {
  production: true,
  apiUrl: '/api'
};
```
