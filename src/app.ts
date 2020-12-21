import { PAGINATION_PAGE_SIZE } from "./constants";

const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;
console.log(PAGINATION_PAGE_SIZE, module);

const server = http.createServer((req: any, res: any) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
