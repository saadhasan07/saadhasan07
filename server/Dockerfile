# Backend Dockerfile for Node.js server (Linux/CI-safe, no lockfile issues)
FROM node:20-alpine
WORKDIR /app
# Only copy package.json, not package-lock.json
COPY package.json ./
RUN npm install --omit=optional
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "index.js"]
