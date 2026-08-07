FROM node:24-alpine

WORKDIR /app

RUN apk update && \
    apk add ffmpeg && \
    apk add tzdata

RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

COPY package*.json .
RUN npm install

CMD ["npm", "run", "dev"]