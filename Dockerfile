# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package.json .
COPY prisma ./prisma
COPY . .

# Install dependencies
RUN npm install --production

# Expose port (matches .env PORT)
EXPOSE 4000

# Start the app
CMD ["node", "dist/server.js"]
