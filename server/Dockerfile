# Backend Dockerfile for Railway deployment (Drizzle-ready, uses npm)
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies (including dev for build/migrations)
COPY package.json package-lock.json ./
RUN npm install --omit=optional

# Copy the rest of the code
COPY . .

# Build the app (if using TypeScript or build step)
RUN if [ -f "tsconfig.json" ]; then npm run build; fi

# --- Drizzle migration step ---
# Railway injects DATABASE_URL at runtime, but for build-time migrations, you can use build args or .env
# If you want to run migrations at build time, uncomment the following lines and ensure DATABASE_URL is available:
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
RUN npx drizzle-kit push:pg
#
# For most PaaS (including Railway), it's best to run migrations at container startup:

# Production image
FROM node:20-alpine AS prod
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./
COPY --from=base /app/.env ./
COPY --from=base /app/drizzle.config.ts ./
COPY --from=base /app/migrations ./migrations

# Expose the port your server runs on
EXPOSE 3000

# Run Drizzle migrations at container startup, then start the server
CMD npx drizzle-kit push:pg && node dist/index.js
