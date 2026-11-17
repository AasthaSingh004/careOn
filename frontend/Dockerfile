# Stage 1: Build React Frontend
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first for Docker layer caching
COPY package*.json ./
RUN npm ci

# Copy source code and build production bundle
COPY . .
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built application from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx reverse proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/nginx-health || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
