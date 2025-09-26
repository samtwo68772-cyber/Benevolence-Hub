
FROM node:20-bookworm

# Install necessary packages for Prisma
RUN apt-get update && apt-get install -y openssl libssl3

# Set up the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 9002
