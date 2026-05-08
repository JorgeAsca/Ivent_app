#!/bin/sh
set -e

echo "Starting microservice ms-administracion..."
exec node dist/apps/ms-administracion/main.js
