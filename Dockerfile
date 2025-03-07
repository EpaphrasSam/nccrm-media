FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache python3 make g++ \
    && npm install --ignore-platform \
    && npm cache clean --force

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the development server
ENV NODE_ENV=development
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]