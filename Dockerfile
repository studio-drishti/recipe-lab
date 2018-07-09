FROM node:9 as base
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
EXPOSE 3000

FROM base as development
ENV NODE_ENV development
COPY package.json yarn.lock ./
RUN yarn
COPY .babelrc next.config.js postcss.config.js ./
COPY server ./
COPY pages components util config ./
COPY jest.config.js jest.setup.js __mocks__ __tests__ ./
CMD [ "yarn", "dev" ]
