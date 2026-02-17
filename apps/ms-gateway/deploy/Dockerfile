# Fase 1: Instalación y Compilación
FROM node:20-alpine AS build

ARG MICROSERVICIO=ms-gateway

WORKDIR /app


RUN npm install -g pnpm


COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json nest-cli.json ./
COPY ./libs ./libs
COPY ./apps/${MICROSERVICIO} ./apps/${MICROSERVICIO}


RUN pnpm install
RUN pnpm --filter ms-gateway run build


FROM node:20-alpine AS runner

ARG MICROSERVICIO=ms-gateway
WORKDIR /app


COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/${MICROSERVICIO}/dist ./dist
COPY --from=build /app/package.json ./package.json

# Exponer puerto
EXPOSE 3000


CMD ["node", "dist/main.js"]s