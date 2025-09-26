# Use the official Node.js 20 image.
FROM node:20-bookworm

# Set the working directory in the container
WORKDIR /app

# Install dependencies needed for Prisma and other native modules
RUN apt-get update && apt-get install -y procps openssl libssl1.1 && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 9002

# The command to run the app will be provided via docker-compose
CMD []
