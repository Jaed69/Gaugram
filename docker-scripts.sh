#!/bin/bash

# Scripts para manejo de Docker - Gaugram

case "$1" in
  "dev")
    echo "🚀 Iniciando entorno de desarrollo..."
    docker-compose -f docker-compose.dev.yml up --build
    ;;
  "prod")
    echo "🚀 Iniciando entorno de producción..."
    docker-compose up --build -d
    ;;
  "stop")
    echo "⏹️ Deteniendo servicios..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    ;;
  "clean")
    echo "🧹 Limpiando contenedores y imágenes..."
    docker-compose down --volumes --rmi all
    docker system prune -f
    ;;
  "logs")
    echo "📄 Mostrando logs..."
    docker-compose logs -f
    ;;
  "shell-api")
    echo "🐚 Accediendo al contenedor de la API..."
    docker exec -it gaugram_api sh
    ;;
  "shell-db")
    echo "🐚 Accediendo a MongoDB..."
    docker exec -it gaugram_mongo mongosh gaugram
    ;;
  "backup")
    echo "💾 Creando backup de la base de datos..."
    docker exec gaugram_mongo mongodump --db gaugram --out /tmp/backup
    docker cp gaugram_mongo:/tmp/backup ./backup-$(date +%Y%m%d-%H%M%S)
    ;;
  *)
    echo "📖 Uso: $0 {dev|prod|stop|clean|logs|shell-api|shell-db|backup}"
    echo ""
    echo "  dev        - Inicia entorno de desarrollo con hot reload"
    echo "  prod       - Inicia entorno de producción"
    echo "  stop       - Detiene todos los servicios"
    echo "  clean      - Limpia contenedores e imágenes"
    echo "  logs       - Muestra logs en tiempo real"
    echo "  shell-api  - Accede al contenedor de la API"
    echo "  shell-db   - Accede a MongoDB"
    echo "  backup     - Crea backup de la base de datos"
    ;;
esac
