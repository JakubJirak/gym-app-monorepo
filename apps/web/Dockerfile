FROM oven/bun:1 AS base

# Install dependencies
FROM base AS deps
WORKDIR /app

# Zkopíruj všechny package.json soubory
COPY package.json bun.lock turbo.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/convex/package.json ./packages/convex/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json

# Instaluj závislosti
RUN bun install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app

# Zkopíruj node_modules z deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps ./apps
COPY --from=deps /app/packages ./packages

# Zkopíruj zdrojový kód
COPY . .

# Build argumenty
ARG VITE_CONVEX_URL
ENV VITE_CONVEX_URL=${VITE_CONVEX_URL}

# Build pouze web aplikaci
RUN bun run build --filter=web

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Zkopíruj build output
# Pro TanStack Start je to obvykle .vinxi nebo .output
COPY --from=builder /app/apps/web/.vinxi ./apps/web/.vinxi
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json

# Pokud máš .output místo .vinxi:
# COPY --from=builder /app/apps/web/.output ./apps/web/.output

EXPOSE 3000

WORKDIR /app/apps/web
CMD ["bun", "run", "serve"]