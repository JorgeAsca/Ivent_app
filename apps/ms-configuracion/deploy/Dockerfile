# Stage 1: Build
FROM node:20-alpine AS build

ARG MICROSERVICIO
ENV APP_NAME=${MICROSERVICIO}
WORKDIR /app

# Install pnpm and native build dependencies
RUN apk add --no-cache python3 make g++ git bash
RUN npm install -g pnpm

# Copy monorepo configuration files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json nest-cli.json ./
COPY ./libs ./libs
COPY ./apps/${APP_NAME} ./apps/${APP_NAME}

# 1. Install ALL dependencies (required to build the common lib)
RUN pnpm install --no-frozen-lockfile

# 2. IMPORTANT: Build the shared library first
RUN pnpm --filter common build

# 3. Build the specific microservice
# Generate Prisma Client ONLY if the prisma directory exists in the app
RUN if [ -d "./apps/${APP_NAME}/prisma" ]; then npx prisma generate --schema=./apps/${APP_NAME}/prisma/schema.prisma; fi

RUN npx nest build ${APP_NAME}

# 4. Clean up and fetch production dependencies only (using hoisted mode to prevent symlink issues)
RUN pnpm install --prod --no-frozen-lockfile --config.node-linker=hoisted --config.confirm-modules-purge=false

# Stage 2: Runner
FROM node:20-alpine AS runner

ARG MICROSERVICIO
ENV APP_NAME=${MICROSERVICIO}
WORKDIR /app

# Copy real compiled files
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

# Copy start script and ensure execution permissions
COPY --from=build /app/apps/${APP_NAME}/deploy/start.sh ./start.sh
RUN chmod +x ./start.sh

ENV NODE_ENV=production

# Execute
CMD ["sh", "/app/start.sh"]
