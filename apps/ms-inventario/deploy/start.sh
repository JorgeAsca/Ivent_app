#!/bin/bash
set -e

echo "*** Instalacion del micro servicio ${MICROSERVICIO} ***"

echo "Instalando pnpm..."
npm install -g pnpm
if [ $? -ne 0 ]; then
   echo "Error al instalar pnpm. Abortando."
   exit 1
fi

echo "Instalando dependencias (pnpm install)..."
pnpm install
if [ $? -ne 0 ]; then
   echo "Error al instalar dependencias. Abortando."
   exit 1
fi

echo "Iniciando ${MICROSERVICIO} en modo desarrollo..."
exec pnpm run start:dev ${MICROSERVICIO}