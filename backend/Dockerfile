# syntax=docker/dockerfile:1

# ---- Stage 1: Build ----
FROM node:24.12-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Stage 2: Runtime ----
FROM node:24.12-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=5000

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

COPY --from=builder /app/dist ./dist

USER node
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:${PORT}/health || exit 1

CMD ["node", "dist/index.js"]
