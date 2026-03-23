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

# 4. Compilamos primero las librerías comunes y luego el microservicio desde la raíz
RUN pnpm --filter common build
RUN npx nest build ${MICROSERVICIO}

# --- Fase Runner ---
FROM node:20-alpine AS runner
WORKDIR /app
ARG MICROSERVICIO=ms-gateway
ENV APP_NAME=${MICROSERVICIO}

# Copiamos dependencias y el directorio dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist

EXPOSE 3000

# ¡Aquí está la ruta exacta que descubrimos!
CMD ["node", "dist/apps/ms-gateway/apps/ms-gateway/src/main.js"]