FROM node:22.11.0-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/ms-usuarios/package.json ./apps/ms-usuarios/


RUN pnpm install --frozen-lockfile

COPY . .

RUN chmod +x ./apps/ms-usuarios/deploy/start.sh

ENTRYPOINT ["./apps/ms-usuarios/deploy/start.sh"]