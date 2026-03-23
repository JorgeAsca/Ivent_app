FROM node:20-alpine AS build

ARG MICROSERVICIO=ms-gateway
WORKDIR /app

RUN npm install -g pnpm

# 1. Copiamos configuraciones del monorepo
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json nest-cli.json ./

# 2. Copiamos librerías y la app específica
COPY ./libs ./libs
COPY ./apps/${MICROSERVICIO} ./apps/${MICROSERVICIO}

# 3. Instalamos dependencias
RUN pnpm install

# 4. Compilamos common primero
RUN pnpm --filter common build

# 5. EL TRUCO: Compilar DESDE LA RAÍZ usando nest CLI para no perder el contexto de TS
RUN npx nest build ${MICROSERVICIO}

# --- Fase Runner ---
FROM node:20-alpine AS runner
WORKDIR /app
ARG MICROSERVICIO=ms-gateway

# Copiamos dependencias de producción
COPY --from=build /app/node_modules ./node_modules

# 6. NestJS genera el build en una subcarpeta global, la copiamos directo al ./dist final
COPY --from=build /app/dist/apps/${MICROSERVICIO} ./dist
COPY --from=build /app/apps/${MICROSERVICIO}/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/main.js"]