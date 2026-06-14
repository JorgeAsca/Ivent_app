# Stage 1: Dependencies (cacheable)
FROM node:20-alpine AS deps

ARG MICROSERVICIO
ENV APP_NAME=${MICROSERVICIO}
WORKDIR /app

RUN apk add --no-cache python3 make g++ git bash
RUN npm install -g pnpm

# Copy dependency-related files first (this layer is cached if deps don't change)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY ./apps/${APP_NAME}/package.json ./apps/${APP_NAME}/package.json

# Install ALL dependencies (root + app-specific)
RUN pnpm install --no-frozen-lockfile

# Stage 2: Build
FROM deps AS build

ARG MICROSERVICIO
ENV APP_NAME=${MICROSERVICIO}

# Copy source code
COPY tsconfig.json nest-cli.json ./
COPY ./libs ./libs
COPY ./apps/${APP_NAME} ./apps/${APP_NAME}

# Build the library and microservice
RUN pnpm --filter common build 2>/dev/null || true
RUN if [ -d "./apps/${APP_NAME}/prisma" ]; then npx prisma generate --schema=./apps/${APP_NAME}/prisma/schema.prisma; fi
RUN npx nest build ${APP_NAME} --webpack

# Stage 3: Production dependencies
FROM deps AS prod-deps

RUN pnpm install --prod --no-frozen-lockfile --config.node-linker=hoisted --config.confirm-modules-purge=false

# Stage 4: Runner (minimal image)
FROM node:20-alpine AS runner

ARG MICROSERVICIO
ENV APP_NAME=${MICROSERVICIO}
WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/apps/${APP_NAME}/deploy/start.sh ./start.sh

RUN chmod +x ./start.sh
ENV NODE_ENV=production

CMD ["sh", "/app/start.sh"]