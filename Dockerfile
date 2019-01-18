FROM node:10.12-alpine

ADD . /usr/src/app/
RUN cd /usr/src/app/ && yarn

EXPOSE 2810
WORKDIR /usr/src/app
ENTRYPOINT ["sh", "-c", "yarn start"]
