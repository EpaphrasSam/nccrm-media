FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the development server
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]