const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const router = require('./app/router');
const config = require('./config');

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(router);

app.listen(config.server.port);

module.exports = app;
