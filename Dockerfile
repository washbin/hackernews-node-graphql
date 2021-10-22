# syntax=docker/dockerfile:1

FROM node:14.17-alpine

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN export NODE_ENV=production
RUN yarn install --production --frozen-lockfile
COPY . .
RUN yarn prisma generate
CMD ["yarn", "run", "dev"]
