FROM nginx:1.17.3-alpine as base
EXPOSE 80

COPY /_nginx/nginx.conf /etc/nginx/nginx.conf
COPY /_nginx/env.js /etc/nginx/env.js
COPY /_nginx/default.conf /etc/nginx/conf.d/default.conf
# 创建目录
RUN mkdir -p /etc/nginx/ssl
COPY /_nginx/9794625__chinayasha.com.pem /etc/nginx/ssl
COPY /_nginx/9794625__chinayasha.com.key /etc/nginx/ssl
COPY /dist/ /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
