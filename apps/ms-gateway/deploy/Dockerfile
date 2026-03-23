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

# 4. Compilamos usando los filtros nativos de pnpm desde la raíz
RUN pnpm --filter common build
RUN pnpm --filter ${MICROSERVICIO} build

# --- Fase Runner ---
FROM node:20-alpine AS runner
WORKDIR /app
ARG MICROSERVICIO=ms-gateway

# Copiamos las dependencias
COPY --from=build /app/node_modules ./node_modules

# 5. Pnpm deja el resultado exactamente dentro de la carpeta de la app
COPY --from=build /app/apps/${MICROSERVICIO}/dist ./dist
COPY --from=build /app/apps/${MICROSERVICIO}/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/main.js"]