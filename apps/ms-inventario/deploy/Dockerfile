FROM node:20-alpine

ARG MICROSERVICIO=ms-inventario
ENV MICROSERVICIO=${MICROSERVICIO} 

WORKDIR /app

# Instalar dependencias de sistema y pnpm
RUN apk add --no-cache python3 make g++ git bash
RUN npm install -g pnpm

# Copiar archivos de configuración de la raíz
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json tsconfig.build.json nest-cli.json ./

# Copiar librerías compartidas y el código del microservicio
COPY ./libs ./libs
COPY ./apps/${MICROSERVICIO} ./apps/${MICROSERVICIO}


RUN pnpm install --frozen-lockfile


RUN pnpm run build ${MICROSERVICIO}


COPY ./apps/${MICROSERVICIO}/deploy/start.sh .
RUN sed -i 's/\r$//' start.sh && chmod +x start.sh

EXPOSE 3000

ENTRYPOINT [ "./start.sh" ]