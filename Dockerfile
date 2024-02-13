FROM node:20-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json package-lock.json ./

COPY . .

RUN npm ci

RUN npm run build

CMD ["node", "dist/main"]