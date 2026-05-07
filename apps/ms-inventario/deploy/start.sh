#!/bin/bash
set -e

echo "Arrancando microservicio ms-inventario..."
exec node dist/apps/ms-inventario/src/main.js