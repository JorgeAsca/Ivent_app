#!/bin/bash
set -e

echo "Starting microservice ms-gateway..."
exec node dist/apps/ms-gateway/main.js