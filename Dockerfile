# Use a specific slim image for Node.js
FROM node:20-bookworm-slim

# Set working directory
WORKDIR /app

# Install dependencies for Prisma and other native modules
RUN apt-get update && apt-get install -y procps openssl

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of your application's code
COPY . .

# Expose the port your app runs on
EXPOSE 9002

# The command to run your app
CMD ["npm", "run", "dev"]
