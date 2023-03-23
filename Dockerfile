FROM node:18-alpine

WORKDIR /app

COPY package*.json /app
COPY yarn.lock /app

RUN yarn

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "preview", "--port=3000", "--host=0.0.0.0"]