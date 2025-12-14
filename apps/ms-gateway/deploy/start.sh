#!/bin/bash
set -e

# Definimos log para monitorear el arranque
INFORME=/root/logs/informe.log
mkdir -p /root/logs

echo "*** Instalacion del micro servicio ${MICROSERVICIO} ***" > ${INFORME}

# 1. Instalamos PNPM (Gestor de paquetes)
echo "Instalando pnpm..." >> ${INFORME}
npm install -g pnpm
if [ $? -ne 0 ]; then
   echo "Error al instalar pnpm. Abortando." >> ${INFORME}
   exit 1
fi


echo "Instalando dependencias (pnpm install)..." >> ${INFORME}

pnpm install --no-frozen-lockfile
if [ $? -ne 0 ]; then
   echo "Error al instalar dependencias. Abortando." >> ${INFORME}
   exit 1
fi


echo "Iniciando ${MICROSERVICIO} en modo desarrollo..." >> ${INFORME}

exec pnpm run start:dev ${MICROSERVICIO}