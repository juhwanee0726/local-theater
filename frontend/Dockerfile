FROM node:22-alpine AS builder

WORKDIR /app

COPY *.json .
RUN npm install

COPY . .

RUN npm run build

###

FROM nginx:stable-alpine

COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html/dist

CMD ["nginx", "-g", "daemon off;"]