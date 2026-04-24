FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files if they exist (otherwise we'll just copy the files)
# For this project, we'll copy everything directly as it's a simple server
COPY . .

# Expose port 5001 as used in server.js
EXPOSE 5001

# Command to run the application
CMD [ "node", "server.js" ]
