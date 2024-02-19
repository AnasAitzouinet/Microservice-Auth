# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

RUN npx prisma generate

# Expose a port (if needed)
EXPOSE 8080

# Define the command to run your application
CMD [ "npm", "start" ]
