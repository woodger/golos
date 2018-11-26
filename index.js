const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//const redisdb = require('./app/asserts/redis-db');
const redis = require('redis');
const router = require('./app/router');
const config = require('./config');

const server = async () => {
  const app = express();

  app.locals.redis = redis.createClient();

  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(router);

  app.listen(config.server.port);

  return app;
};

module.exports = server();
