#!/bin/bash
set -e

INFORME=/root/logs/informe.log
mkdir -p /root/logs

echo "*** Despliegue - \$\{MICROSERVICIO\} ***" > \$\{INFORME\}

echo "Instalando herramientas globales (pnpm, tsx)..." >> \$\{INFORME\}
npm install -g pnpm
npm install -g tsx

pnpm config set ignore-scripts false

echo "Instalando dependencias..." >> \$\{INFORME\}

pnpm install --frozen-lockfile

echo "Iniciando \$\{MICROSERVICIO\}..." >> \$\{INFORME\}
exec pnpm run start:dev \$\{MICROSERVICIO\}