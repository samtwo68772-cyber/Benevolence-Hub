# Use Node.js LTS (Long Term Support) version
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy rest of the application code
COPY . .

# Build application
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Environment variables
ENV NODE_ENV=production
ENV PORT=9002

# Copy necessary files from builder
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 9002

# Start application
CMD ["node", "server.js"]