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

# 2. Instalamos dependencias
echo "Instalando dependencias (pnpm install)..." >> ${INFORME}
# --frozen-lockfile usa versiones exactas del pnpm-lock.yaml para estabilidad
pnpm install --frozen-lockfile
if [ $? -ne 0 ]; then
   echo "Error al instalar dependencias. Abortando." >> ${INFORME}
   exit 1
fi

# 3. Arrancamos el Gateway
echo "Iniciando ${MICROSERVICIO} en modo desarrollo..." >> ${INFORME}
# Usamos exec para que el proceso reciba señales del sistema correctamente
exec pnpm run start:dev ${MICROSERVICIO}