#!/bin/bash
set -e

INFORME=/root/logs/informe.log
mkdir -p /root/logs

echo "*** Instalacion del micro servicio ${MICROSERVICIO} ***" > ${INFORME}

# 1. Instalar PNPM
echo "Instalando pnpm..." >> ${INFORME}
npm install -g pnpm

# 2. Configurar PNPM para permitir scripts de construcción
pnpm config set ignore-scripts false

# 3. Instalar Dependencias
echo "Instalando dependencias..." >> ${INFORME}
pnpm install --frozen-lockfile

# --- FIX CRÍTICO: Reconstruir bcrypt para Alpine ---
echo "Reconstruyendo bcrypt..." >> ${INFORME}
pnpm rebuild bcrypt
# ---------------------------------------------------

# 4. Generar Prisma
echo "Generando Prisma Client..." >> ${INFORME}
# Entramos al directorio específico para asegurar que Prisma encuentre el schema
cd /app/apps/${MICROSERVICIO}
npx prisma generate
cd /app

# 5. Arrancar
echo "Iniciando ${MICROSERVICIO}..." >> ${INFORME}
exec pnpm run start:dev ${MICROSERVICIO}