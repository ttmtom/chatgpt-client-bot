FROM node:14.18.1-alpine AS builder

FROM builder AS nestjs-dev
WORKDIR /usr/src/app/
COPY ./ /usr/src/app/
RUN ["yarn", "install"]

FROM nestjs-dev AS nestjs-prod
RUN ["yarn", "run", "build"]

FROM postgres:12-alpine AS postgres
WORKDIR /docker-entrypoint-initdb.d
ADD init.sql /docker-entrypoint-initdb.d
