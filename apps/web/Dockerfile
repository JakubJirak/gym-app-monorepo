FROM oven/bun:1 AS base

# Install dependencies
FROM base AS deps
WORKDIR /app

# Zkopíruj root config
COPY package.json bun.lock turbo.json ./

# Zkopíruj CELÉ packages (obsahují typescript config, eslint config, atd.)
COPY packages ./packages

# Zkopíruj app package.json
COPY apps/web/package.json ./apps/web/package.json

# Instaluj závislosti
RUN bun install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app

# Zkopíruj node_modules z deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

# Zkopíruj packages
COPY packages ./packages

# Zkopíruj web app
COPY apps/web ./apps/web

# Zkopíruj root config
COPY turbo.json package.json ./

# Build argumenty
ARG VITE_CONVEX_URL
ENV VITE_CONVEX_URL=${VITE_CONVEX_URL}

# Build pouze web aplikaci
RUN bun run build --filter=web

# Production
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Zkopíruj build output
COPY --from=builder /app/apps/web/.vinxi ./apps/web/.vinxi
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json

EXPOSE 3000

WORKDIR /app/apps/web
CMD ["bun", "run", "serve"]