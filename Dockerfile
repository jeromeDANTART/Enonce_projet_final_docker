FROM node:14-alpine
WORKDIR app
COPY package.json .
COPY server.js .
COPY public/ ./public
RUN npm install
CMD ["node", "server.js"]