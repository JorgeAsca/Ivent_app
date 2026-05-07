# Etapa 1: Construcción
FROM node:20-alpine AS build

WORKDIR /app

RUN npm install -g pnpm

# Copiamos archivos base
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json nest-cli.json ./
COPY ./libs ./libs
COPY ./apps/ms-analytics ./apps/ms-analytics

# Instalamos TODAS las dependencias (incluyendo dev para compilar)
RUN pnpm install --frozen-lockfile

# Compilamos
RUN npx nest build ms-analytics

# Limpiamos node_modules y descargamos solo las de producción de forma física
# La bandera --prod y el config de pnpm evitan symlinks hacia la raíz fuera de la imagen
RUN pnpm install --prod --frozen-lockfile --config.node-linker=hoisted

# Etapa 2: Ejecución
FROM node:20-alpine AS runner

WORKDIR /app

# Copiamos los archivos reales compilados y los módulos físicos
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/apps/ms-analytics/deploy/start.sh ./start.sh

RUN chmod +x ./start.sh

ENV NODE_ENV=production

CMD ["sh", "/app/start.sh"]