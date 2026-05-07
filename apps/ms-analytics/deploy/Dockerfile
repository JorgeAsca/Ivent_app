# Etapa 1: Construcción
FROM node:20-alpine AS build

WORKDIR /app

# Instalamos pnpm
RUN npm install -g pnpm

# Copiamos archivos de configuración de dependencias
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json nest-cli.json ./
COPY ./libs ./libs
COPY ./apps/ms-analytics ./apps/ms-analytics

# Instalamos dependencias y compilamos
RUN pnpm install --frozen-lockfile
RUN npx nest build ms-analytics

# Etapa 2: Ejecución (Imagen ligera)
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

# Copiamos solo lo necesario desde la etapa de build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/apps/ms-analytics/deploy/start.sh ./start.sh

RUN chmod +x ./start.sh

# Variables de entorno por defecto
ENV NODE_ENV=production

CMD ["sh", "/app/start.sh"]