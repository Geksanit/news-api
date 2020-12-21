import http from 'http';

import { PAGINATION_PAGE_SIZE } from './constants';
import { HttpError } from './utils/Errors';

const hostname = '127.0.0.1';
const port = 3000;
console.log(PAGINATION_PAGE_SIZE, 1234);

const err = new HttpError(404, 'not found');
console.log(err);

const server = http.createServer((req, res) => {
  console.log('request', req);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
