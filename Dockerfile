# ============================================================
# Stage 1: Build the React Frontend (Vite)
# ============================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/Frontend

# Install frontend dependencies
COPY Frontend/package*.json ./
RUN npm ci

# Copy frontend source code and build
COPY Frontend/ ./
RUN npm run build

# ============================================================
# Stage 2: Install Backend Dependencies
# ============================================================
FROM node:20-alpine AS backend-builder
WORKDIR /app/Backend

COPY Backend/package*.json ./
RUN npm ci --omit=dev

# ============================================================
# Stage 3: Final Production Runner
# ============================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=development
ENV PORT=5000
ENV CURRENT_USER_ID=current_user

# Copy Backend production dependencies and source
COPY --from=backend-builder /app/Backend/node_modules ./Backend/node_modules
COPY Backend/package.json ./Backend/package.json
COPY Backend/src/ ./Backend/src/
COPY Backend/seed/ ./Backend/seed/
COPY Backend/asset/ ./Backend/asset/

# Create runtime data directory
RUN mkdir -p /app/Backend/data

# Copy built frontend assets to be served by Express
COPY --from=frontend-builder /app/Frontend/dist ./Frontend/dist

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Start server
CMD ["node", "Backend/src/server.js"]
