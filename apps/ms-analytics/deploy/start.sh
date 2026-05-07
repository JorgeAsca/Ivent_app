#!/bin/bash
set -e


INFORME=/root/logs/informe.log
mkdir -p /root/logs

echo "*** Despliegue - ${MICROSERVICIO} ***" > ${INFORME}

echo "Instalando herramientas globales..." >> ${INFORME}
npm install -g pnpm


pnpm config set ignore-scripts false

echo "Instalando dependencias..." >> ${INFORME}

pnpm install --no-frozen-lockfile

echo "Iniciando ${MICROSERVICIO} en modo producción..." >> ${INFORME}


exec node dist/apps/${MICROSERVICIO}/src/main.js