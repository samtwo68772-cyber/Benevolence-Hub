# Use an official Node.js runtime as a parent image
FROM node:20-bookworm-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Make the wait-for-it.sh script executable
RUN chmod +x /app/wait-for-it.sh

# Expose the port the app runs on
EXPOSE 9002

# The command to start the app will be handled by docker-compose
CMD []
