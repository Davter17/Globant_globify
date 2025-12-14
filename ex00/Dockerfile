# Multi-stage build: Backend + Frontend

# Stage 1: Backend (Node.js)
FROM node:20-alpine AS backend
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --production
COPY server/ ./

# Stage 2: Final image
FROM nginx:alpine

# Install node and supervisor
RUN apk add --no-cache nodejs npm supervisor

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy frontend files
COPY src /usr/share/nginx/html

# Copy backend files with node_modules
COPY --from=backend /app/server /app/server

# Supervisor config
RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisord.conf

# Expose ports
EXPOSE 8080 3000

# Start supervisor (runs both nginx and node)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
