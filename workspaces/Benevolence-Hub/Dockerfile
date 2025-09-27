# Use the official Node.js 20 image based on Debian Bookworm Slim
FROM node:20-bookworm-slim

# Set the working directory
WORKDIR /app

# Install dependencies for Prisma and other tools
RUN apt-get update && apt-get install -y procps postgresql-client && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 9002

# The command to run the application will be handled by docker-compose.yml
CMD ["npm", "start"]
