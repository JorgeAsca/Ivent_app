#!/bin/bash
set -e

INFORME=/root/logs/informe.log
mkdir -p /root/logs

echo "*** Iniciando reparación y despliegue de ${MICROSERVICIO} ***" > ${INFORME}

# 1. Instalar PNPM
echo "Instalando pnpm..." >> ${INFORME}
npm install -g pnpm

# 2. Configurar PNPM
pnpm config set ignore-scripts false

# 3. Instalar Dependencias
echo "Instalando dependencias..." >> ${INFORME}
pnpm add -D @types/pg @types/bcrypt
pnpm install --frozen-lockfile

# --- FIX 1: Reconstruir bcrypt ---
echo "Reconstruyendo bcrypt..." >> ${INFORME}
pnpm rebuild bcrypt

# --- FIX 2: Ocultar prisma.config.ts problemático ---
echo "Ocultando prisma.config.ts..." >> ${INFORME}
# Si el archivo existe, le cambiamos el nombre para que Prisma no lo lea y no falle
if [ -f "/app/apps/${MICROSERVICIO}/prisma.config.ts" ]; then
    mv /app/apps/${MICROSERVICIO}/prisma.config.ts /app/apps/${MICROSERVICIO}/prisma.config.ts.bak
fi

# 4. Generar Prisma
echo "Generando Prisma Client..." >> ${INFORME}
cd /app/apps/${MICROSERVICIO}
npx prisma generate
cd /app

# 5. Arrancar
echo "Iniciando ${MICROSERVICIO}..." >> ${INFORME}
exec pnpm run start:dev ${MICROSERVICIO}