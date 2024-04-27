FROM --platform=linux/amd64 node:16-alpine
WORKDIR /front
COPY . .
RUN npm i --verbose
CMD ["npm", "run", "dev"]