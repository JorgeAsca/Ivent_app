FROM node:20-alpine

ARG MICROSERVICIO=ms-inventario
ENV MICROSERVICIO=${MICROSERVICIO} 

WORKDIR /app


RUN apk add --no-cache python3 make g++ git bash


RUN npm install -g pnpm


COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json tsconfig.build.json nest-cli.json ./


COPY ./apps/${MICROSERVICIO}/deploy/start.sh .
RUN sed -i 's/\r$//' start.sh && chmod +x start.sh

EXPOSE 3000

ENTRYPOINT [ "./start.sh" ]