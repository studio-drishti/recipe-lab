FROM node:9

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
RUN yarn

COPY . .

EXPOSE 3000
CMD [ "yarn", "dev" ]
