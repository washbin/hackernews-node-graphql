# syntax=docker/dockerfile:1

FROM node:14.17-alpine

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npx prisma generate
CMD npm run dev
