# Use the official Node.js 20 image as a parent image.
# This version of Debian ("Bullseye") includes libssl1.1 which is required by Prisma.
FROM node:20-bullseye

# Set the working directory in the container.
WORKDIR /app

# Copy package.json and package-lock.json to the working directory.
COPY package*.json ./

# Install app dependencies.
RUN npm install

# Copy the rest of the application's source code to the working directory.
COPY . .

# Copy the wait-for-it.sh script and make it executable
COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

# The Next.js app will be started by the command in docker-compose.yml
# This CMD is a fallback if the container is run without a command.
CMD ["npm", "start"]
