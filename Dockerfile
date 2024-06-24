FROM --platform=linux/amd64 node:16-alpine

WORKDIR /front

# Копируем package.json и package-lock.json перед остальными файлами, чтобы избежать повторного установки зависимостей, если они не изменились
COPY package*.json ./

RUN npm install

# Копируем остальные файлы
COPY . .

CMD ["npm", "run", "dev"]
