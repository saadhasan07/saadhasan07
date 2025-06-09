# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS production
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/.env* ./
EXPOSE 5000
CMD ["npm", "start"]
