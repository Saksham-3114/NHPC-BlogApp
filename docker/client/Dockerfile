FROM node

WORKDIR /app

COPY ../../apps/client/package*.json ./

RUN npm install

COPY ../../apps/client .

RUN npm run build

EXPOSE 3000

CMD [ "npm","start" ]