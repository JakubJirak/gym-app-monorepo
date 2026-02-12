FROM oven/bun:1 AS base

# Install dependencies
FROM base AS deps
WORKDIR /app

# Zkopíruj celý workspace strukture před instalací
COPY package.json bun.lock turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web
COPY apps/mobile/package.json ./apps/mobile/package.json

# Nyní může Bun správně vyřešit workspace
RUN bun install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app

# Zkopíruj node_modules z deps
COPY --from=deps /app/node_modules ./node_modules

# Zkopíruj znovu packages a apps
COPY packages ./packages
COPY apps/web ./apps/web
COPY turbo.json package.json ./

# Build argumenty
ARG VITE_CONVEX_URL
ENV VITE_CONVEX_URL=${VITE_CONVEX_URL}

# Build
RUN bun run build --filter=web

# Production
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/apps/web/.vinxi ./apps/web/.vinxi
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json

EXPOSE 3000

WORKDIR /app/apps/web
CMD ["bun", "run", "serve"]