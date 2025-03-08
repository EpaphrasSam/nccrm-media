FROM node:20-alpine AS builder

WORKDIR /app

# Copy configuration files
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.ts ./

# Install dependencies
ENV NEXT_TELEMETRY_DISABLED=1
ENV npm_config_platform=linux
ENV npm_config_arch=x64
ENV npm_config_target_platform=linux
ENV npm_config_target_arch=x64

RUN npm ci

# Copy source code
COPY . .

# Mount env file during build
RUN --mount=type=secret,id=env,target=/app/.env.production \
    cp /app/.env.production /app/.env

# Build the application
ENV NODE_ENV=production
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env .env

# Don't run as root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]