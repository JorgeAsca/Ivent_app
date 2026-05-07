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

# Forzar la compilación para generar la carpeta dist con las dependencias vinculadas
echo "Compilando ms-analytics..." >> ${INFORME}
npx nest build ms-analytics

echo "Iniciando ms-analytics..." >> ${INFORME}
# Usamos la ruta completa del monorepo que confirmamos antes
exec node dist/apps/ms-analytics/src/main.js