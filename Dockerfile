# Root Dockerfile for Railway deployment (Drizzle-ready, no pnpm, supports monorepo, fixed paths, node:20-slim)
FROM node:20-slim AS base

WORKDIR /app

# Install root dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=optional

# Copy the rest of the code
COPY . .

# Build the backend (if using TypeScript)
RUN cd server && if [ -f "tsconfig.json" ]; then npm run build; fi

# Build the frontend
RUN cd client && npm install --omit=optional && npm run build

# --- Drizzle migration step ---
# Railway injects DATABASE_URL at runtime, so run migrations at container startup

FROM node:20-slim AS prod
WORKDIR /app

# Copy built code and node_modules
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/server/dist ./server/dist
COPY --from=base /app/server/.env ./server/  # Only if you have a .env in server
COPY --from=base /app/server/drizzle.config.ts ./server/
COPY --from=base /app/server/migrations ./server/migrations
COPY --from=base /app/client/dist ./client/dist

# Expose backend port
EXPOSE 3000

# Install global tools for serving and migrations
RUN npm install -g serve concurrently drizzle-kit

# Start: run Drizzle migrations, then backend, and serve frontend with a static server
CMD concurrently "cd server && npx drizzle-kit push:pg && node dist/index.js" "serve -s client/dist -l 8080"