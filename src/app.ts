import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import { Sequelize } from 'sequelize';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';
import * as OpenApiValidator from 'express-openapi-validator';

dotenv.config();

import * as categories from './modules/categories';
import { log } from './libs/log';
import { errorHandler } from './middlewares/errorHandler';

const apiSpec = path.resolve(__dirname, './openapi/generated.yaml');
const swaggerDocument = yaml.load(apiSpec);

const sequelize = new Sequelize(process.env.DB_NAME, 'postgres', process.env.DB_PASS, {
  host: 'localhost',
  dialect: 'postgres',
});
const hostname = '127.0.0.1';
const port = 3000;
const app = express();

app.use(bodyParser.json());
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

app.use('/categories', categories.makeRouter(sequelize));

app.use(errorHandler);

app.listen(port, hostname, () => {
  log.info(`Server running at http://${hostname}:${port}/`);
  log.info(`Swagger running at http://${hostname}:${port}/api-docs`);
});
