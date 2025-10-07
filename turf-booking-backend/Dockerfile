# Use Node 20 base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose the backend port
EXPOSE 3000

# Start the backend
CMD ["npm", "start"]
