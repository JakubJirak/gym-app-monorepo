FROM oven/bun:1.3.0 AS builder
WORKDIR /app

# Zkopíruj vše najednou
COPY . .

# Instaluj dependencies
RUN bun install

# Build argumenty
ARG VITE_CONVEX_URL
ENV VITE_CONVEX_URL=${VITE_CONVEX_URL}

# Build
RUN bun run build --filter=gym-app

# Production
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Zkopíruj build output (.output místo .vinxi)
COPY --from=builder /app/apps/web/.output ./apps/web/.output
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json

EXPOSE 3000

WORKDIR /app/apps/web

# Spusť server
CMD ["bun", ".output/server/index.mjs"]