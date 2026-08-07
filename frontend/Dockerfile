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
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html/dist

CMD ["nginx", "-g", "daemon off;"]