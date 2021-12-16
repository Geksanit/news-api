/* eslint-disable import/first */
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { Sequelize } from 'sequelize';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';
import * as OpenApiValidator from 'express-openapi-validator';
import cors from 'cors';

import * as categories from './modules/categories';
import * as users from './modules/users';
import * as authors from './modules/authors';
import * as news from './modules/news';
import * as drafts from './modules/news/drafts';
import * as comments from './modules/comments';
import * as tags from './modules/tags';
import { log } from './libs/log';
import { errorHandler } from './middlewares/errorHandler';
import { initializeAuth } from './auth';
import { getConfig } from './config';
import { createModelsStore } from './models/models.store';

const apiSpec = path.resolve(__dirname, './openapi/generated.yaml');
const swaggerDocument = yaml.load(apiSpec);
const config = getConfig();
const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASS, {
  host: 'localhost',
  dialect: 'postgres',
});
const app = express();

app.use(
  cors({
    credentials: true,
    origin: [
      'https://localhost:3000',
      'https://127.0.0.1:3000',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
  }),
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req, res) => {
  log.info('request', req.method, req.url);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

app.use(
  OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true,
    // validateResponses: false,
  }),
);

initializeAuth(app, sequelize);
const modelsStore = createModelsStore(sequelize);

app.use('/posts', news.makeRouter(sequelize, modelsStore));
app.use('/drafts', drafts.makeRouter(sequelize, modelsStore));
app.use('/comments', comments.makeRouter(modelsStore));
app.use('/tags', tags.makeRouter(modelsStore));
app.use('/categories', categories.makeRouter(modelsStore));
app.use('/users', users.makeRouter(modelsStore));
app.use('/authors', authors.makeRouter(modelsStore));

app.use(errorHandler);

app.listen(config.PORT, config.HOST, () => {
  log.info(`Server running at http://${config.HOST}:${config.PORT}/`);
  log.info(`Swagger running at http://${config.HOST}:${config.PORT}/api-docs`);
});
