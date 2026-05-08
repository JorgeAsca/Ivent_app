#!/bin/bash
set -e

echo "Starting microservice ms-administracion..."
# Temporarily using the nested path found by find
exec node dist/apps/ms-administracion/apps/ms-administracion/src/main.js
