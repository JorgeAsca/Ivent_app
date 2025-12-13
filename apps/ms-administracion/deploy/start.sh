#!/bin/bash
set -e

INFORME=/root/logs/informe.log
mkdir -p /root/logs

echo "*** Iniciando reparación y despliegue de ${MICROSERVICIO} ***" > ${INFORME}

# 1. Instalar PNPM
echo "Instalando pnpm..." >> ${INFORME}
npm install -g pnpm

# 2. Configurar PNPM (Vital para Prisma)
pnpm config set ignore-scripts false

# 3. Instalar Dependencias (Incluyendo tipos faltantes)
echo "Instalando dependencias..." >> ${INFORME}
# Forzamos la instalación de tipos de PG por si no estaban en el package.json
pnpm add -D @types/pg @types/bcrypt
pnpm install --frozen-lockfile

# 4. Generar Prisma (En el lugar correcto)
echo "Generando Prisma Client..." >> ${INFORME}
# Ejecutamos generate DENTRO del microservicio
cd /app/apps/${MICROSERVICIO}
npx prisma generate
cd /app

# 5. Arrancar
echo "Iniciando ${MICROSERVICIO}..." >> ${INFORME}
exec pnpm run start:dev ${MICROSERVICIO}