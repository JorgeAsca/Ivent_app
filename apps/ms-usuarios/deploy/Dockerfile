FROM node:22.11.0-alpine

# Instalamos pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app


ARG MICROSERVICIO=ms-usuarios


COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/${MICROSERVICIO}/package.json ./apps/${MICROSERVICIO}/


RUN pnpm install --no-frozen-lockfile


COPY . .


RUN chmod +x ./apps/${MICROSERVICIO}/deploy/start.sh

ENTRYPOINT ["./apps/ms-usuarios/deploy/start.sh"]