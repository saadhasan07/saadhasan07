# Use official Node.js LTS image
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY . .

RUN npm install
RUN npm run build

EXPOSE 80
CMD ["npm", "start"]
