FROM node:12.20.1-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

CMD npm run start