FROM node:18-slim

# Security: Create a non-root user
RUN groupadd -r vantage && useradd -r -g vantage -m vantage

WORKDIR /usr/src/app

# Copy dependency manifests first (layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev --ignore-scripts 2>/dev/null || true

# Copy application source
COPY . .

# Security: Set proper ownership and permissions
RUN chown -R vantage:vantage /usr/src/app

# Switch to non-root user
USER vantage

# Expose Cloud Run default port
EXPOSE 8080

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "const http=require('http');http.get('http://localhost:8080/',(r)=>{process.exit(r.statusCode===200?0:1)}).on('error',()=>process.exit(1))"

# Start the application
CMD ["node", "server.js"]
