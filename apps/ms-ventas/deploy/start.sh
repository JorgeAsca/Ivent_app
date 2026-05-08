#!/bin/bash
set -e

echo "Starting microservice ms-ventas..."
exec node dist/apps/ms-ventas/main.js