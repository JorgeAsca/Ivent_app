FROM node:20-alpine


ARG MICROSERVICIO=ms-inventario

WORKDIR /app


RUN apk add --no-cache python3 make g++ git bash



COPY ./apps/${MICROSERVICIO}/deploy/start.sh .
RUN chmod +x start.sh

COPY package.json .
COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY tsconfig.json .
COPY nest-cli.json .

# Copiamos las librerías y el código del microservicio
COPY ./libs ./libs
COPY ./apps/${MICROSERVICIO} ./apps/${MICROSERVICIO}

# Exponemos el puerto interno (siempre 3000 como pediste)
EXPOSE 3000

ENTRYPOINT [ "./start.sh" ]