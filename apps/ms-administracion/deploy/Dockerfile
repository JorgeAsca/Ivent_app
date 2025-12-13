FROM node:20-alpine

ARG MICROSERVICIO=ms-administracion

WORKDIR /app


COPY ./apps/${MICROSERVICIO}/deploy/start.sh .
RUN chmod +x start.sh


COPY package.json .
COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY tsconfig.json .
COPY nest-cli.json .


COPY ./libs ./libs
COPY ./apps/${MICROSERVICIO} ./apps/${MICROSERVICIO}


RUN apk add --no-cache git bash

EXPOSE 3000


ENTRYPOINT [ "./start.sh" ]