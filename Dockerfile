# Use an official Node.js runtime as a parent image
FROM node:20-bookworm

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock, etc.)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application's code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Make port 9002 available to the world outside this container
EXPOSE 9002

# Define the command to run your app
# The actual command to run dev/start will be in docker-compose.yml
CMD ["npm", "run", "dev"]
