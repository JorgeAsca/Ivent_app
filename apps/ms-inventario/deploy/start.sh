cd ~/apps/Ivent_app/apps/ms-inventario/deploy

cat << 'EOF' > start.sh
#!/bin/bash
set -e

echo "*** Instalacion del micro servicio ${MICROSERVICIO} ***"

# 1. Limpieza nuclear: Borramos rastros viejos para forzar reinstalación real
echo "Borrando node_modules y lockfile antiguos..."
rm -rf node_modules pnpm-lock.yaml

echo "Instalando pnpm..."
npm install -g pnpm

echo "Instalando dependencias desde cero..."
# Sin lockfile y forzando la instalación
pnpm install

echo "Iniciando ${MICROSERVICIO} en modo desarrollo..."
exec pnpm run start:dev ${MICROSERVICIO}
EOF

# Permisos
chmod +x start.sh
sed -i 's/\r$//' start.sh