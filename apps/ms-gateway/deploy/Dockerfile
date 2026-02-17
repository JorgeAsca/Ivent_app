FROM node:20-alpine AS build

ARG MICROSERVICIO=ms-gateway
WORKDIR /app

RUN npm install -g pnpm

# Copiar archivos base
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json nest-cli.json ./
# Copiar TODO el código necesario para las dependencias internas
COPY ./libs ./libs
COPY ./apps/${MICROSERVICIO} ./apps/${MICROSERVICIO}

# Instalar dependencias
RUN pnpm install

# Compilar: Primero common, luego el microservicio
# Usamos 'nest build' directamente para asegurar que lea bien las rutas
RUN pnpm --filter common build
RUN pnpm --filter ${MICROSERVICIO} build

# --- Fase Runner ---
FROM node:20-alpine AS runner
WORKDIR /app
ARG MICROSERVICIO=ms-gateway

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/${MICROSERVICIO}/dist ./dist
COPY --from=build /app/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/main.js"]