# Stage 1: Build
FROM node:20-alpine AS build

ARG MICROSERVICIO
ENV APP_NAME=${MICROSERVICIO}
WORKDIR /app

RUN apk add --no-cache python3 make g++ git bash
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json nest-cli.json ./
COPY ./libs ./libs
COPY ./apps/${APP_NAME} ./apps/${APP_NAME}

RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter common build
# Generate Prisma Client ONLY if the prisma directory exists in the app
RUN if [ -d "./apps/${APP_NAME}/prisma" ]; then npx prisma generate --schema=./apps/${APP_NAME}/prisma/schema.prisma; fi

RUN npx nest build ${APP_NAME}
RUN pnpm install --prod --no-frozen-lockfile --config.node-linker=hoisted --config.confirm-modules-purge=false

# Stage 2: Runner
FROM node:20-alpine AS runner

ARG MICROSERVICIO
ENV APP_NAME=${MICROSERVICIO}
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/apps/${APP_NAME}/prisma ./prisma
COPY --from=build /app/apps/${APP_NAME}/deploy/start.sh ./start.sh

RUN chmod +x ./start.sh
ENV NODE_ENV=production

CMD ["sh", "/app/start.sh"]