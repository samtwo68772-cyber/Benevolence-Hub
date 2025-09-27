# Dockerfile

# Use the official Node.js 20 image.
# https://hub.docker.com/_/node
FROM node:20-bookworm-slim

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies.
RUN npm install --production

# Copy local code to the container image.
COPY . .

# Build the app.
RUN npm run build

# Expose the port that the application will listen on.
EXPOSE 9002

# Run the application.
CMD ["npm", "start"]
