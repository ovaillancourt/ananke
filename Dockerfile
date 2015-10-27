FROM node:4-slim

ENV PORT="80" CHRONOS_URI="http://chronos.app.internal"

WORKDIR /app

ADD package.json /app/package.json
RUN npm i --production --silent
ADD . /app

CMD ["start"]

ENTRYPOINT ["npm","run"]
