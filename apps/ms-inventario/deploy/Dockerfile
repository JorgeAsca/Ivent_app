FROM node:20-alpine

ARG MICROSERVICIO=ms-inventario
# IMPORTANTE: Esto pasa la variable del build al entorno de ejecución
ENV MICROSERVICIO=${MICROSERVICIO} 

WORKDIR /app

RUN apk add --no-cache python3 make g++ git bash

COPY ./apps/${MICROSERVICIO}/deploy/start.sh .
RUN sed -i 's/\r$//' start.sh
RUN chmod +x start.sh

COPY package.json .
COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY tsconfig.json .
# --- AQUI ESTABA EL ERROR: FALTABA ESTA LINEA ---
COPY tsconfig.build.json . 
# ------------------------------------------------
COPY nest-cli.json .

COPY ./libs ./libs
COPY ./apps/${MICROSERVICIO} ./apps/${MICROSERVICIO}

EXPOSE 3000

ENTRYPOINT [ "./start.sh" ]