# Use a specific Node.js version with a slim base image
FROM node:20-bookworm-slim

# Set the working directory in the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 9002

# The command to run the application will be in docker-compose.yml
CMD ["npm", "start"]
