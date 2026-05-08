#!/bin/bash
set -e

echo "Starting microservice ms-terceros..."
exec node dist/apps/ms-terceros/main.js