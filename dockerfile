FROM arm64v8/node:16.20 AS builder

FROM builder AS nestjs-dev
WORKDIR /usr/src/app/
COPY ./ /usr/src/app/
RUN ["yarn", "install", "--network-timeout", "600000"]

FROM nestjs-dev AS nestjs-prod
RUN ["yarn", "run", "build"]
