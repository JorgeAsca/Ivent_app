#!/bin/bash
set -e

echo "Starting microservice ms-usuarios..."
exec node dist/apps/ms-usuarios/main.js