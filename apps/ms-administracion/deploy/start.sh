#!/bin/sh
set -e

echo "Applying database migrations..."
if [ -d "./prisma" ]; then npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss; fi

echo "Starting microservice ${APP_NAME}..."

FLAT_PATH="dist/apps/${APP_NAME}/main.js"
NESTED_PATH="dist/apps/${APP_NAME}/apps/${APP_NAME}/src/main.js"

if [ -f "$FLAT_PATH" ]; then
  exec node "$FLAT_PATH"
elif [ -f "$NESTED_PATH" ]; then
  exec node "$NESTED_PATH"
else
  echo "Error: Could not find main.js for ${APP_NAME}"
  exit 1
fi
