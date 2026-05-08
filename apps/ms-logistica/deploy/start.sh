#!/bin/bash
set -e

echo "Starting microservice ms-logistica..."
exec node dist/apps/ms-logistica/main.js