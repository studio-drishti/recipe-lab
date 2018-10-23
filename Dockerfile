FROM node:10 as base
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
EXPOSE 3000

FROM base as development
ENV NODE_ENV development
COPY package.json package-lock.json ./
RUN npm install
COPY .babelrc next.config.js postcss.config.js ./
COPY server ./
COPY pages components util config ./
COPY jest.config.js jest.setup.js __mocks__ __tests__ ./
RUN npm run build
CMD [ "npm", "run", "start:dev" ]
