# 1. Use an official Node.js runtime as a parent image
FROM node:22

# 2. Set the working directory in the container
WORKDIR /src/app

# 3. Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# 4. Install the necessary dependencies
RUN npm install

# 5. Copy the rest of the application code to the working directory
COPY . .

# 6. Expose the port that the application will run on
EXPOSE 3000

# 7. Define the command to run the application
CMD ["node", "app.js"]
