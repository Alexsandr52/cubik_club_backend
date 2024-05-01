# устанавливаем официальный образ Node.js
FROM node:19-alpine

# указываем рабочую (корневую) директорию
WORKDIR /app

# копируем основные файлы приложения в рабочую директорию
COPY package.json package-lock.json ./

# устанавливаем указанные зависимости NPM на этапе установки образа
RUN npm install

# после установки копируем все файлы проекта в корневую директорию
COPY . ./

# запускаем основной скрипт в момент запуска контейнера
CMD npm start

EXPOSE 5000