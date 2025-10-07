# 1. Base Image: Use an official Node.js runtime as the parent image.
# We choose a lightweight version (alpine) for smaller image size.
FROM node:22-alpine

# 2. Working Directory: Set the working directory inside the container.
WORKDIR /usr/src/app

# 3. Copy Package Files: Copy the package.json and package-lock.json first.
# This step is cached, so only changes to package.json trigger a full reinstall.
COPY package*.json ./

# 4. Install Dependencies: Run npm install to download packages listed in package.json.
RUN npm install

# 5. Copy Source Code: Copy the rest of the application source code into the container.
# This includes server.js and products.json.
COPY . .

# 6. Expose Port: Tell Docker which port the container listens on at runtime.
# This should match the PORT defined in your server.js (3001).
EXPOSE 3001

# 7. Start Command: Define the command to run the application when the container starts.
CMD [ "node", "server.js" ]