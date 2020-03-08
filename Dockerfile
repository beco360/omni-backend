FROM node:13.5.0
# WORKDIR /home/app
# COPY package*.json ./
RUN npm install
# COPY . .
CMD [ "nodemon", "-r dotenv/config src/server.js" ]
