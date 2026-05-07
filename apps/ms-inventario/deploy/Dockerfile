FROM node:20-alpine AS build
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json nest-cli.json ./
COPY ./libs ./libs
COPY ./apps/ms-inventario ./apps/ms-inventario
RUN pnpm install --no-frozen-lockfile
RUN npx nest build ms-inventario
RUN pnpm install --prod --no-frozen-lockfile --config.node-linker=hoisted --config.confirm-modules-purge=false

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/apps/ms-inventario/deploy/start.sh ./start.sh
RUN chmod +x ./start.sh
ENV NODE_ENV=production
CMD ["sh", "/app/start.sh"]