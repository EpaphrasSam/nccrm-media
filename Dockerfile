FROM node:20-alpine AS builder

WORKDIR /app

# Copy only necessary files for installation
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.ts ./

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Install dependencies with only production packages
RUN npm ci --only=production && \
    npm rebuild @next/swc-linux-x64-gnu && \
    npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build && \
    rm -rf src .next/cache

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only necessary files from builder
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Don't run as root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]