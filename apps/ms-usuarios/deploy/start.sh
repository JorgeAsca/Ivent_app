#!/bin/sh
set -e


INFORME=/root/logs/ms-usuarios.log
mkdir -p /root/logs

echo "*** Iniciando Microservicio Usuarios ***" > ${INFORME}

cd /app/apps/ms-usuarios



echo "Iniciando NestJS en modo watch..." >> ${INFORME}
exec pnpm run start:dev ms-usuarios