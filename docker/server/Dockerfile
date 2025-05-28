FROM node

WORKDIR /app

COPY ../../apps/server/package*.json ./

RUN npm install

COPY ../../apps/server .

RUN npm run build

EXPOSE 5000

CMD [ "npm","run","dev" ]