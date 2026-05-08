#!/bin/bash
set -e

echo "Starting microservice ms-inventario..."
exec node dist/apps/ms-inventario/main.js