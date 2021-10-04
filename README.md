# Node.js проект новостного сайта

Использованные библиотеки:
- База данных [PostgreSQL](https://www.postgresql.org/)
- ORM for Postgres [Sequelize](https://sequelize.org/)
- Веб-фреймворк для Node.js [Express](https://expressjs.com/)
- [typescript](https://www.typescriptlang.org/)

### yarn команды <a name="yarn"></a> 
- установка проекта: `yarn install`
- запуск в production режиме: `yarn prod`
- запуск в dev режиме: `yarn dev`
- синхронизация столбцов БД с моделями `yarn syncModels`
- запись тестовых данных в базу `yarn createModels`
- генерация типов по openapi спецификации `yarn gen:types`
- генерация спеки для swagger `yarn gen:swagger`
- генерация соли для хеширования паролей `yarn gen:salt`
- миграции `npx sequelize-cli db:migrate`

### Переменные окружения <a name="env"></a> 
.env
```
DB_PASS
DB_NAME
DB_USER
HASH_SALT
JWT_SECRET_KEY
```
необязательно
```
HOST
PORT
```

### Описание функциональных требований <a name="spec"></a>
https://rizzoma.com/topic/c27faf1cfa188c1120f59af4c35e6099/0_b_9n8n_8jl3r/