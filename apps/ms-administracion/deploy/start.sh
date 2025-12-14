#!/bin/bash
set -e

INFORME=/root/logs/informe.log
mkdir -p /root/logs

echo "*** Despliegue PRISMA 7 (Native) - ${MICROSERVICIO} ***" > ${INFORME}

# 1. Instalar Herramientas Globales
echo "Instalando herramientas globales (pnpm, tsx)..." >> ${INFORME}
npm install -g pnpm
# --- FIX: Instalar tsx para que Prisma pueda leer prisma.config.ts ---
npm install -g tsx
# ---------------------------------------------------------------------

pnpm config set ignore-scripts false

# 2. Instalar Dependencias
echo "Instalando dependencias..." >> ${INFORME}
# Aseguramos bcryptjs y types
pnpm add bcryptjs
pnpm add -D @types/bcryptjs @types/pg
pnpm install --frozen-lockfile

# 3. Generar Cliente y Migrar
echo "Generando Prisma Client..." >> ${INFORME}
cd /app/apps/${MICROSERVICIO}

# Prisma 7 usará 'tsx' automáticamente si está instalado para leer prisma.config.ts
npx prisma generate

echo "Ejecutando Migraciones..." >> ${INFORME}
# Forzamos la variable de entorno justo antes del comando por seguridad
export DATABASE_URL="postgres://${DB_USER}:${DB_PASSWORD}@db-administracion:5432/${DB_NAME}?schema=public"
npx prisma migrate deploy

cd /app

# 4. Arrancar
echo "Iniciando ${MICROSERVICIO}..." >> ${INFORME}
exec pnpm run start:dev ${MICROSERVICIO}