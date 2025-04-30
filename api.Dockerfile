FROM node:20.5.1-alpine

WORKDIR /app

RUN npm i -g pnpm

COPY ./package.json ./pnpm-* ./
COPY ./tsconfig*.json ./
COPY ./apps/api ./apps/api
COPY ./apps/shared ./apps/shared

RUN pnpm install --frozen-lockfile && pnpx prisma generate --schema=./apps/api/prisma/schema.prisma

CMD [ "pnpm", "server:dev" ]
