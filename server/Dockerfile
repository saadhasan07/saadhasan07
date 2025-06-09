# Backend Dockerfile for Node.js server (TypeScript build, Linux/CI-safe)
FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=optional
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]
