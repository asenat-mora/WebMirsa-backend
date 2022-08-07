FROM node:16.0.0-alpine3.13 AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

FROM node:16.0.0-alpine3.13 AS release

ARG NODE_ENV=production

COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm install --only=production

CMD [ "npm", "run", "start" ]
