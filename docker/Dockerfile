# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages
RUN npm install

# Expose port 3000 for the React app
EXPOSE 3000

# Start the development server when the container starts
CMD ["npm", "start"]

