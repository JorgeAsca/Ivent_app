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

# Pasamos el ARG a variable de entorno para poder usarlo en el comando shell final
ENV APP_NAME=${MICROSERVICIO}

# Copiamos dependencias y TODO el directorio dist sin alterar su estructura
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist

EXPOSE 3000

# 5. EL COMANDO INTELIGENTE: Busca el archivo main.js en las 3 rutas posibles de NestJS y lo ejecuta.
CMD sh -c "if [ -f dist/apps/${APP_NAME}/main.js ]; then node dist/apps/${APP_NAME}/main.js; elif [ -f dist/apps/${APP_NAME}/src/main.js ]; then node dist/apps/${APP_NAME}/src/main.js; elif [ -f dist/main.js ]; then node dist/main.js; else echo '❌ Error: No se encontró main.js. Mostrando contenido de dist:' && ls -R dist && exit 1; fi"