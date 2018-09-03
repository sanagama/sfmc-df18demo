#
# Based on this excellent guide: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
#
FROM node:8
LABEL author="Sanjay Nagamangalam <sanagama2@gmail.com>"
LABEL version=1.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

# Transpile TypeScript to JavaScript
RUN npm run-script build

EXPOSE 8080
CMD [ "npm", "start" ]