
# Use a Node.js version that is compatible with your project
FROM node:20-bookworm

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's code
COPY . .

# Expose the port your app runs on
EXPOSE 9002

# The command to run your application
CMD ["npm", "run", "dev"]
