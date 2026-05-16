# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the backend port (assuming 5000 based on common patterns)
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
