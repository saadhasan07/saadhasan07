# Root Dockerfile for Railway deployment (Drizzle-ready, no pnpm, supports monorepo)
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files and install dependencies for both root and server
COPY package.json package-lock.json ./
COPY server/package.json server/package-lock.json ./server/
RUN npm install --omit=optional && cd server && npm install --omit=optional

# Copy the rest of the code
COPY . .

# Build the backend (if using TypeScript)
RUN cd server && if [ -f "tsconfig.json" ]; then npm run build; fi

# Build the frontend
RUN cd client && npm install --omit=optional && npm run build

# --- Drizzle migration step ---
# Railway injects DATABASE_URL at runtime, so run migrations at container startup

FROM node:20-alpine AS prod
WORKDIR /app

# Copy built code and node_modules
COPY --from=base /app/server/node_modules ./server/node_modules
COPY --from=base /app/server/dist ./server/dist
COPY --from=base /app/server/package.json ./server/
COPY --from=base /app/server/.env ./server/
COPY --from=base /app/server/drizzle.config.ts ./server/
COPY --from=base /app/server/migrations ./server/migrations
COPY --from=base /app/client/dist ./client/dist
COPY --from=base /app/client/package.json ./client/

# Expose backend port
EXPOSE 3000

# Start: run Drizzle migrations, then backend, and serve frontend with a static server
RUN npm install -g serve concurrently drizzle-kit

CMD concurrently "cd server && npx drizzle-kit push:pg && node dist/index.js" "serve -s client/dist -l 8080"