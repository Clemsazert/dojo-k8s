# Node base image
FROM node:22.13-alpine AS build

# Set working directory
WORKDIR /app

# Copy the npm project files needed for install to the container
COPY package*.json ./

# Install dependencies via NPM
RUN npm install

# Copy the project files to the container
COPY . .

# Install dependencies via NPM
RUN npm run build

# Stage 2 : run
FROM node:22.13-alpine AS production

# Set working directory
WORKDIR /app

# Copy the npm project files needed for install to the container
COPY package*.json ./

# Install production dependencies via NPM
RUN npm ci --omit=dev

# Copy build directory from stage 1
COPY --from=build /app/dist .

# Setup ENV variable
ENV NODE_ENV=production
ENV PORT=80

# Expose port 80 to allow incoming traffic
EXPOSE 80

# Start the Node web server
CMD ["node", "index.js"]
