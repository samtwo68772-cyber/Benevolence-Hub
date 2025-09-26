# Use a specific Node.js version with a compatible Debian release
FROM node:20-bookworm

# Set the working directory in the container
WORKDIR /app

# Install dependencies for Prisma
RUN apt-get update && apt-get install -y procps openssl

# Copy package.json and package-lock.json (or yarn.lock, etc.)
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 9002

# The command to run the application
CMD ["npm", "run", "dev"]
