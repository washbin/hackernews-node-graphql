# syntax=docker/dockerfile:1

FROM node:14.17-alpine
EXPOSE 4000

WORKDIR /app
COPY package.json yarn.lock .
ENV NODE_ENV=production
RUN yarn install --production --frozen-lockfile
COPY . .
RUN yarn prisma generate
CMD ["yarn", "run", "dev"]
