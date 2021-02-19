FROM node:12.20.1-alpine

WORKDIR /app

COPY package.json .

RUN npm install

EXPOSE 80
EXPOSE 5050

COPY . .

CMD npm run start