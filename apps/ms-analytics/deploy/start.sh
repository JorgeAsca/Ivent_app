#!/bin/bash
set -e

# Logs de arranque
INFORME=/root/logs/informe.log
mkdir -p /root/logs
echo "*** Arrancando ms-analytics ***" > ${INFORME}

# Instalación de herramientas
npm install -g pnpm
pnpm config set ignore-scripts false

# Instalación de dependencias
echo "Instalando dependencias..." >> ${INFORME}
pnpm install --no-frozen-lockfile

# COMPILACIÓN MANUAL (Esto es lo que falta)
echo "Compilando ms-analytics..." >> ${INFORME}
npx nest build ms-analytics

# EJECUCIÓN CON RUTA FIJA
echo "Iniciando proceso node..." >> ${INFORME}
exec node dist/apps/ms-analytics/src/main.js