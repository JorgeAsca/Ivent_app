#!/bin/bash
set -e

# Ya no instalamos nada aquí, Docker ya lo hizo
echo "Arrancando microservicio ms-analytics..."

# Ejecutamos directamente el archivo compilado
exec node dist/apps/ms-analytics/src/main.js