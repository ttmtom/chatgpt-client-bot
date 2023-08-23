FROM node:18.17.1-alpine3.18 AS builder

FROM builder AS nestjs-dev
WORKDIR /usr/src/app/
COPY ./ /usr/src/app/
RUN ["yarn", "install"]

FROM nestjs-dev AS nestjs-prod
RUN ["yarn", "run", "build"]
