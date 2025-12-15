#!/bin/bash
set -e

INFORME=/root/logs/informe.log
mkdir -p /root/logs

echo "*** Despliegue PRISMA 7 (Native) - ${MICROSERVICIO} ***" > ${INFORME}

echo "Instalando herramientas globales (pnpm, tsx)..." >> ${INFORME}
npm install -g pnpm
npm install -g tsx

pnpm config set ignore-scripts false

echo "Instalando dependencias..." >> ${INFORME}
# --- LÍNEAS ELIMINADAS AQUÍ ---
# pnpm add bcryptjs  <-- ESTO CAUSABA EL ERROR
# pnpm add -D @types/bcryptjs @types/pg <-- ESTO TAMBIÉN
# ------------------------------

# Esto instalará todo lo que esté en tu package.json (que ya incluye bcryptjs)
pnpm install --frozen-lockfile

echo "Generando Prisma Client..." >> ${INFORME}
cd /app/apps/${MICROSERVICIO}

npx prisma generate

echo "Ejecutando Migraciones..." >> ${INFORME}
export DATABASE_URL="postgres://${DB_USER}:${DB_PASSWORD}@db-administracion:5432/${DB_NAME}?schema=public"
npx prisma migrate deploy

cd /app

echo "Iniciando ${MICROSERVICIO}..." >> ${INFORME}
exec pnpm run start:dev ${MICROSERVICIO}