@echo off
REM Scripts para manejo de Docker - Gaugram (Windows)

if "%1"=="dev" (
    echo 🚀 Iniciando entorno de desarrollo...
    docker-compose -f docker-compose.dev.yml up --build
) else if "%1"=="prod" (
    echo 🚀 Iniciando entorno de producción...
    docker-compose up --build -d
) else if "%1"=="stop" (
    echo ⏹️ Deteniendo servicios...
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
) else if "%1"=="clean" (
    echo 🧹 Limpiando contenedores y imágenes...
    docker-compose down --volumes --rmi all
    docker system prune -f
) else if "%1"=="logs" (
    echo 📄 Mostrando logs...
    docker-compose logs -f
) else if "%1"=="shell-api" (
    echo 🐚 Accediendo al contenedor de la API...
    docker exec -it gaugram_api sh
) else if "%1"=="shell-db" (
    echo 🐚 Accediendo a MongoDB...
    docker exec -it gaugram_mongo mongosh gaugram
) else if "%1"=="backup" (
    echo 💾 Creando backup de la base de datos...
    docker exec gaugram_mongo mongodump --db gaugram --out /tmp/backup
    docker cp gaugram_mongo:/tmp/backup ./backup-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%
) else (
    echo 📖 Uso: %0 {dev^|prod^|stop^|clean^|logs^|shell-api^|shell-db^|backup}
    echo.
    echo   dev        - Inicia entorno de desarrollo con hot reload
    echo   prod       - Inicia entorno de producción
    echo   stop       - Detiene todos los servicios
    echo   clean      - Limpia contenedores e imágenes
    echo   logs       - Muestra logs en tiempo real
    echo   shell-api  - Accede al contenedor de la API
    echo   shell-db   - Accede a MongoDB
    echo   backup     - Crea backup de la base de datos
)
