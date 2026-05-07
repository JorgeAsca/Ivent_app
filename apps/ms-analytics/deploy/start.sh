#!/bin/bash
set -e

INFORME=/root/logs/informe.log
mkdir -p /root/logs

echo "*** Despliegue - ${MICROSERVICIO} ***" > ${INFORME}

echo "Instalando pnpm..." >> ${INFORME}
npm install -g pnpm

# CRÍTICO: Permitir scripts para que Prisma genere el cliente
pnpm config set ignore-scripts false

echo "Instalando dependencias..." >> ${INFORME}
pnpm install --no-frozen-lockfile

# NUEVO: Compilar el proyecto antes de ejecutarlo
echo "Compilando ${MICROSERVICIO}..." >> ${INFORME}
npx nest build ${MICROSERVICIO}

echo "Iniciando ${MICROSERVICIO}..." >> ${INFORME}
exec node dist/apps/${MICROSERVICIO}/src/main.js