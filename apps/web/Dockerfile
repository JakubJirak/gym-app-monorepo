# Prune stage (jen pro Turbo v monorepu)
FROM oven/bun:1 AS pruner
WORKDIR /app
COPY package.json bun.lock turbo.json ./
COPY apps/web/package.json ./apps/web/
RUN bun install
COPY . .
RUN turbo prune --scope=web --docker

# Builder stage
FROM oven/bun:1 AS builder
WORKDIR /app
COPY --from=pruner /app/out/json .
COPY --from=pruner /app/out/full .
RUN bun install
RUN turbo run build --filter=web...

# Production stage
FROM oven/bun:1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/web/dist ./
EXPOSE 3000
CMD ["bun", "run", "start"]
