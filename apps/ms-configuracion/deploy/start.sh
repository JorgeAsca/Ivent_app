#!/bin/bash
set -e

echo "Arrancando microservicio ms-configuracion..."
exec node dist/apps/ms-configuracion/main.js