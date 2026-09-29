FROM node:20-alpine
WORKDIR /srv
COPY package.json ./
RUN npm install --omit=dev
COPY server.js index.html ./
EXPOSE 8080
CMD ["node", "server.js"]
