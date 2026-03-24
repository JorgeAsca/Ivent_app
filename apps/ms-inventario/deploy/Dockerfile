FROM node:20-alpine

ARG MICROSERVICIO=ms-inventario
ENV MICROSERVICIO=${MICROSERVICIO} 

WORKDIR /app

# Herramientas necesarias para clonar y compilar
RUN apk update && apk add --no-cache git python3 make g++ bash

# Copiamos el script corregido arriba
COPY ./apps/${MICROSERVICIO}/deploy/start.sh .
RUN chmod +x ./start.sh
RUN mkdir -p /root/logs

EXPOSE 3000

CMD ["/bin/bash", "/app/start.sh"]