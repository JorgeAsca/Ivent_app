#!/bin/bash
set -e

echo "Applying database migrations..."
if [ -d "./prisma" ]; then npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss; fi

echo "Starting microservice ms-usuarios..."
exec node dist/apps/ms-usuarios/main.js