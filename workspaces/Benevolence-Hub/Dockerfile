# Use the official Node.js 20 image.
FROM node:20-bookworm-slim

# Set the working directory in the container
WORKDIR /app

# Install dependencies for Prisma and other native modules
RUN apt-get update && apt-get install -y openssl

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 9002

# The command to start the app will be handled by docker-compose.yml
# This ensures the database is ready before the app starts.
CMD ["npm", "run", "start"]
