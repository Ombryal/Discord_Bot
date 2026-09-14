FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

npm install --omit=dev

COPY . .

CMD ["npm", "start"]
