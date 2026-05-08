#!/bin/bash
set -e
echo "Arrancando microservicio ms-analytics..."
exec node dist/apps/ms-analytics/main.js