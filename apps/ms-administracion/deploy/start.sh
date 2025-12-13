#!/bin/bash
set -e

# Definimos log para ver qué pasa si el contenedor falla
INFORME=/root/logs/informe.log
mkdir -p /root/logs

echo "*** Iniciando instalación de ${MICROSERVICIO} ***" > ${INFORME}

# 1. Instalamos PNPM (Igual que el profesor)
# Nota: Es mejor hacer esto en el Dockerfile, pero seguimos el patrón del video/repo.
echo "Instalando pnpm..." >> ${INFORME}
npm install -g pnpm
if [ $? -ne 0 ]; then
    echo "Error al instalar pnpm. Abortando." >> ${INFORME}
    exit 1
fi

# 2. Instalamos dependencias del proyecto (node_modules)
echo "Instalando dependencias (pnpm install)..." >> ${INFORME}
# --frozen-lockfile asegura que se usen versiones exactas del pnpm-lock.yaml
pnpm install --frozen-lockfile
if [ $? -ne 0 ]; then
    echo "Error al instalar dependencias. Abortando." >> ${INFORME}
    exit 1
fi

# 3. Generamos el cliente de Prisma (Necesario si usas Prisma)
echo "Generando Prisma Client..." >> ${INFORME}
pnpm prisma generate --schema=./apps/${MICROSERVICIO}/prisma/schema.prisma

# 4. Arrancamos la aplicación
echo "Iniciando ${MICROSERVICIO} en puerto 3000..." >> ${INFORME}
# Usamos exec para que el proceso de Node sea el PID 1 (reciba señales de apagado)
exec pnpm run start:dev ${MICROSERVICIO}