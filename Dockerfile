# Multi-stage production Dockerfile for Queeny Foreign Trade AI Workflow with SQLite & Prisma

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
# Prisma schema + config are required up front so the `postinstall: prisma generate`
# (triggered by `npm ci`) can locate the schema.
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Generate Prisma Client for SQLite
RUN npx prisma generate
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
# /app/prisma is bind-mounted from the host in docker-compose (root-owned), and SQLite
# needs write access to the DB file. Run as root so seeded/write operations work with a
# root-owned host bind mount. (If you prefer a non-root user, chown the host ./prisma
# dir to uid 1001, e.g. `chown -R 1001:1001 ./prisma`, then set USER nextjs again.)
COPY --from=builder /app/prisma ./prisma

# Automatically leverage output traces to reduce image size
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# NOTE: run as root (see comment above). To use an unprivileged user, apply the
# host-side chown and then uncomment `USER nextjs`.
# USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
