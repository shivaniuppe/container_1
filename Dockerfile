FROM node:latest

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 6000

CMD ["node", "app.js"]
