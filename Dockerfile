# Step 1: Build the app
FROM node:latest AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./

RUN npm install

# Copy project files
COPY . .

# Build the production-ready app
RUN npm run build --configuration=production

# Step 2: Serve with Nginx
# Step 2: Serve with Nginx
FROM nginx:latest

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/birthday-app/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]