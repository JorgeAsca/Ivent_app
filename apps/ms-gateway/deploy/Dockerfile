FROM node:20-alpine AS build

ARG MICROSERVICIO=ms-gateway
WORKDIR /app

RUN npm install -g pnpm

# Copiamos archivos de estructura
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json nest-cli.json ./
COPY ./libs ./libs
COPY ./apps/${MICROSERVICIO} ./apps/${MICROSERVICIO}

# Instalamos dependencias de TODO el monorepo
RUN pnpm install

# COMPILAMOS PRIMERO LAS LIBS Y LUEGO EL MS
RUN pnpm --filter common build
RUN pnpm --filter ${MICROSERVICIO} build

# --- Fase final ---
FROM node:20-alpine AS runner
WORKDIR /app
ARG MICROSERVICIO=ms-gateway

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/${MICROSERVICIO}/dist ./dist
COPY --from=build /app/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/main.js"]