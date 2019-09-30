# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY . .
RUN npm install

# run the node app
CMD ["npm", "start"]
