# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package.json
COPY package.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the code
COPY . .

# Build the project
RUN npm run build

# Expose port (change if your app uses a different port)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
