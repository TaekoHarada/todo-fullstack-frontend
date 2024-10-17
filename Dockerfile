# Use the official Node.js image.
FROM node:16

# Set the working directory inside the container.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock if using yarn).
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application code to the container.
COPY . .

# Build the Next.js app for production.
RUN npm run build

# Expose the application port.
EXPOSE 3000

# Start the Next.js app in production mode.
CMD ["npm", "start"]
