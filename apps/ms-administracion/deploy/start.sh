#!/bin/bash
set -e

INFORME=/root/logs/informe.log
mkdir -p /root/logs

echo "*** Instalacion del micro servicio ${MICROSERVICIO} ***" > ${INFORME}

# 1. Instalar PNPM
echo "Instalando pnpm..." >> ${INFORME}
npm install -g pnpm

# 2. Configurar PNPM para permitir scripts de Prisma (¡Vital para el build!)
echo "Configurando permisos de pnpm..." >> ${INFORME}
pnpm config set ignore-scripts false

# 3. Instalar Dependencias
echo "Instalando dependencias..." >> ${INFORME}
pnpm install --frozen-lockfile

# 4. PRISMA (CORREGIDO)
# Usamos --filter para ejecutar prisma DENTRO del contexto del microservicio
echo "Generando Prisma Client..." >> ${INFORME}
pnpm --filter ${MICROSERVICIO} exec prisma generate

# Opcional: Migraciones (Descomenta si lo necesitas, usando también --filter)
echo "Ejecutando migraciones..." >> ${INFORME}
pnpm --filter ${MICROSERVICIO} exec prisma migrate deploy

# 5. Arrancar
echo "Iniciando ${MICROSERVICIO}..." >> ${INFORME}
exec pnpm run start:dev ${MICROSERVICIO}