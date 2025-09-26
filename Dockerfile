# Use the official Node.js 20 image based on Debian Bullseye
FROM node:20-bullseye

# Set environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install pnpm
RUN corepack enable

# Set the working directory in the container
WORKDIR /app

# Install necessary packages including libssl1.1 for Prisma
RUN apt-get update && apt-get install -y libssl1.1 procps && rm -rf /var/lib/apt/lists/*

# Copy package.json and pnpm-lock.yaml to leverage Docker cache
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 9002

# The command to start the app will be handled by docker-compose.yml
CMD ["npm", "run", "dev"]
