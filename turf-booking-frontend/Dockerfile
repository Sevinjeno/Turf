# Stage 1: Build the app
FROM node:20-alpine as build

WORKDIR /app

# Install build tools for native npm modules
RUN apk add --no-cache python3 make g++

# Upgrade npm (optional)
RUN npm install -g npm@11.6.1

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
