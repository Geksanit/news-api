import dotenv from 'dotenv';
import express from 'express';
import { Sequelize } from 'sequelize';

dotenv.config();

import * as categories from './modules/categories';

const sequelize = new Sequelize(process.env.DB_NAME, 'postgres', process.env.DB_PASS, {
  host: 'localhost',
  dialect: 'postgres',
});
const hostname = '127.0.0.1';
const port = 3000;
const app = express();
console.log('app log');

app.use('/categories', categories.makeRouter(sequelize));
// import { HttpError } from './utils/Errors';
// const err = new HttpError(404, 'not found');
// console.log(err);

app.get('/', (req, res) => {
  console.log('request', req.method, req.url);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
