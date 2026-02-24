FROM node:20-alpine

WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install dependencies (ci ensures clean, reliable installs)
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the application port
EXPOSE 5000

# Start the application using the compiled code
CMD ["npm", "start"]
