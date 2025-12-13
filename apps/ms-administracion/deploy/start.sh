#!/bin/bash
set -e

INFORME=/root/logs/informe.log
mkdir -p /root/logs

echo "*** Iniciando despliegue LIMPIO de ${MICROSERVICIO} ***" > ${INFORME}

# 1. Instalar PNPM
echo "Instalando pnpm..." >> ${INFORME}
npm install -g pnpm

# 2. Configurar PNPM
pnpm config set ignore-scripts false

# 3. Instalar Dependencias
echo "Instalando dependencias..." >> ${INFORME}
# Instalamos bcryptjs y sus tipos explícitamente por si acaso no se pillaron antes
pnpm add bcryptjs
pnpm add -D @types/bcryptjs @types/pg
pnpm install --frozen-lockfile

# 4. Generar Prisma
echo "Generando Prisma Client..." >> ${INFORME}
# Ocultar config problemática si existe
if [ -f "/app/apps/${MICROSERVICIO}/prisma.config.ts" ]; then
    mv /app/apps/${MICROSERVICIO}/prisma.config.ts /app/apps/${MICROSERVICIO}/prisma.config.ts.bak
fi

cd /app/apps/${MICROSERVICIO}
npx prisma generate
cd /app

# 5. Arrancar
echo "Iniciando ${MICROSERVICIO}..." >> ${INFORME}
exec pnpm run start:dev ${MICROSERVICIO}