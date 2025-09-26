# Use the official Node.js 20 image.
# https://hub.docker.com/_/node
FROM node:20-bullseye

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN apt-get update && apt-get install -y libssl1.1 && rm -rf /var/lib/apt/lists/*
RUN npm install

# Copy local code to the container image.
COPY . .

# Run the build command which creates the production bundle.
# The --filter=... option is used to only build the 'nextn' workspace.
RUN npm run build

# Set the entrypoint to the production server.
CMD ["npm", "start"]
