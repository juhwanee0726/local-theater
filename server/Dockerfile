#
# ----- Builder ----------
#
FROM node:24 AS builder

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .

RUN npm run build

#
# ----- Production ----------
#
FROM node:24-alpine

WORKDIR /app

RUN apk update && \
    apk add ffmpeg && \
    apk add tzdata

RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

COPY --from=builder /app/dist ./dist
COPY package*.json ./

RUN npm ci --omit=dev

CMD ["node", "dist/main.js"]