FROM node:20.5.1-alpine

WORKDIR /app

RUN npm i -g pnpm

COPY ./package.json ./pnpm-* ./
COPY ./tsconfig*.json ./
COPY ./apps/web ./apps/web
COPY ./apps/shared ./apps/shared

RUN pnpm install --frozen-lockfile && pnpm client:build

CMD [ "pnpm", "client:preview" ]
