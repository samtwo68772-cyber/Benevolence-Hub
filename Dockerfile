# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory
WORKDIR /app

# Install wget and libssl1.1
RUN apt-get update && \
    apt-get install -y wget && \
    wget http://ftp.br.debian.org/debian/pool/main/o/openssl/libssl1.1_1.1.1w-0+deb11u1_amd64.deb && \
    dpkg -i libssl1.1_1.1.1w-0+deb11u1_amd64.deb && \
    rm libssl1.1_1.1.1w-0+deb11u1_amd64.deb

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 9002

# The command to run the application
CMD ["npm", "run", "start"]
