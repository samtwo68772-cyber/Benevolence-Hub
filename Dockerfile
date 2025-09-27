# Use the official Node.js 20 image.
# https://hub.docker.com/_/node
FROM node:20-bookworm-slim

# Set the working directory in the container
WORKDIR /app

# Install dependencies for running browsers, etc.
RUN apt-get update && apt-get install -y \
    wget \
    procps \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 9002

# The healthcheck relies on wget to check if the server is running.
# The server is started with npm start, which is a wrapper around next start
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:9002/api/health || exit 1

# Run the app
CMD ["npm", "run", "start"]

USER node
