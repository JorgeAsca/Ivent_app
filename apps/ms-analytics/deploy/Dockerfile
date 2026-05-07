# Etapa 1: Construcción
FROM node:20-alpine AS build

WORKDIR /app

# Instalamos pnpm globalmente
RUN npm install -g pnpm

# Copiamos archivos de configuración del monorepo
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json nest-cli.json ./
COPY ./libs ./libs
COPY ./apps/ms-analytics ./apps/ms-analytics

# 1. Instalamos dependencias permitiendo que se ignore el error del lockfile (chart.js)
RUN pnpm install --no-frozen-lockfile

# 2. Compilamos el microservicio
RUN npx nest build ms-analytics

# 3. Limpiamos y bajamos solo producción usando modo 'hoisted' (copia física de archivos)
# Desactivamos el purge confirm para que no falle en Docker
RUN pnpm install --prod --no-frozen-lockfile --config.node-linker=hoisted --config.confirm-modules-purge=false

# Etapa 2: Ejecución (Runner)
FROM node:20-alpine AS runner

WORKDIR /app

# Instalamos pnpm en el runner por si el script lo requiere
RUN npm install -g pnpm

# Copiamos los archivos REALES (no symlinks) desde la etapa build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/apps/ms-analytics/deploy/start.sh ./start.sh

# Aseguramos permisos y formato de fin de línea
RUN chmod +x ./start.sh

ENV NODE_ENV=production

# Ejecutamos con la ruta absoluta
CMD ["sh", "/app/start.sh"]