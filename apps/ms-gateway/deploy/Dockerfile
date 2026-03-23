FROM node:20-alpine AS build

# Definimos el argumento para el microservicio
ARG MICROSERVICIO=ms-gateway
WORKDIR /app

RUN npm install -g pnpm

# 1. Copiar archivos de configuración de la RAÍZ (Añadí tsconfig.build.json por si acaso)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json tsconfig.build.json nest-cli.json ./

# 2. Copiar librerías y el microservicio específico
COPY ./libs ./libs
COPY ./apps/${MICROSERVICIO} ./apps/${MICROSERVICIO}

# 3. Instalar dependencias (pnpm las gestiona para todo el workspace)
RUN pnpm install

# 4. COMPILACIÓN: Forzamos que se compile primero la librería common
RUN pnpm --filter common build

# 5. EL TRUCO: Nos mantenemos en la RAÍZ (/app) para no perder el contexto de @app/common
# y usamos el CLI de Nest para compilar el microservicio pasándole el nombre.
WORKDIR /app
RUN npx nest build ${MICROSERVICIO}

# --- Fase Runner ---
FROM node:20-alpine AS runner
WORKDIR /app
ARG MICROSERVICIO=ms-gateway

# Copiamos las dependencias
COPY --from=build /app/node_modules ./node_modules

# OJO AQUÍ: Al compilar desde la raíz, NestJS crea la carpeta 'dist' global
COPY --from=build /app/dist/apps/${MICROSERVICIO} ./dist
COPY --from=build /app/apps/${MICROSERVICIO}/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/main.js"]