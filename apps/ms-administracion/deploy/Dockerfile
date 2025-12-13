FROM node:20-alpine

ARG MICROSERVICIO=ms-administracion

WORKDIR /app

# --- FIX: Instalar herramientas para compilar dependencias nativas (bcrypt) ---
RUN apk add --no-cache python3 make g++ 
# -----------------------------------------------------------------------------

COPY ./apps/${MICROSERVICIO}/deploy/start.sh .
RUN chmod +x start.sh

COPY package.json .
COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY tsconfig.json .
COPY nest-cli.json .

COPY ./libs ./libs
COPY ./apps/${MICROSERVICIO} ./apps/${MICROSERVICIO}

# Instalamos git y bash (ya lo tenías, pero asegúrate que esté)
RUN apk add --no-cache git bash

EXPOSE 3000

ENTRYPOINT [ "./start.sh" ]