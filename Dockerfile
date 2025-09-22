# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Install dependencies needed for adding custom apt repositories
RUN apt-get update && apt-get install -y wget gnupg

# Add Debian Buster repository for libssl1.1
RUN echo 'deb http://deb.debian.org/debian buster main' > /etc/apt/sources.list.d/buster.list

# Update package lists and install libssl1.1
RUN apt-get update && apt-get install -y libssl1.1

# Clean up apt lists to keep the image small
RUN rm /etc/apt/sources.list.d/buster.list && apt-get update

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 9002

# The command to run the application (this will be overridden by docker-compose.yml)
CMD ["npm", "run", "start"]
