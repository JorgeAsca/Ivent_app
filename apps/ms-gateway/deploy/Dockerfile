FROM node:20-alpine AS build

# Definimos el argumento para el microservicio
ARG MICROSERVICIO=ms-gateway
WORKDIR /app

RUN npm install -g pnpm

# 1. Copiar archivos de configuración de la RAÍZ
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json nest-cli.json ./

# 2. Copiar librerías y el microservicio específico
COPY ./libs ./libs
COPY ./apps/${MICROSERVICIO} ./apps/${MICROSERVICIO}

# 3. Instalar dependencias (pnpm las gestiona para todo el workspace)
RUN pnpm install

# 4. COMPILACIÓN: Aquí está el truco
# Forzamos que se compile primero la librería common
RUN pnpm --filter common build

# Compilamos el microservicio asegurando que use el tsconfig de su carpeta
WORKDIR /app/apps/${MICROSERVICIO}
RUN pnpm build

# --- Fase Runner ---
FROM node:20-alpine AS runner
WORKDIR /app
ARG MICROSERVICIO=ms-gateway

# Copiamos las dependencias y el build generado
COPY --from=build /app/node_modules ./node_modules
# Ajustamos la ruta de copiado del dist generado
COPY --from=build /app/apps/${MICROSERVICIO}/dist ./dist
COPY --from=build /app/apps/${MICROSERVICIO}/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/main.js"]