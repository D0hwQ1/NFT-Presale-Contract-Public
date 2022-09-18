FROM node:16.6.0-stretch-slim
MAINTAINER pjt137@naver.com

ENV LC_CTYPE C.UTF-8
ARG DEBIAN_FRONTEND=noninteractive
COPY ./ /app
WORKDIR /app

RUN apt update > /dev/null; apt install nginx -y > /dev/null;
RUN npm i -g pm2; npm i -g ts-node; yarn;

CMD ["./docker/init.sh"]