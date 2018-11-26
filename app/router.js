const fs = require('fs');
const {Router} = require('express');
const FileSystem = require('pwd-fs');
const Cookies = require('./classes/cookies-httponly');
const Calculator = require('./classes/calculator');
const Throttle = require('./classes/throttle');


const router = Router();
const throttle = new Throttle();

// https://github.com/woodger/pwd-fs#constructor-new-filesystempath
const pfs = new FileSystem();


// Простой пинг сервера

router.get('/hello', (req, res) => {
  res.send('Hello World');
});


// Пинг сервера с JSON

router.get('/hello_json', (req, res) => {
  res.json({
    hello: 'world'
  });
});


// Работа с Cookies

router.get('/hello_cookies', (req, res) => {
  let cookies = new Cookies(req, res);

  if (cookies.get('hello') === 'world') {
    cookies.delete('hello');
    console.log('cookies done');
  }
  else {
    cookies.set('hello', 'world');
  }

  res.send('Hello World');
});


// Асинхронная работа

router.get('/wait_5_seconds', (req, res) => {
  setTimeout(() => {
    res.send('done');
  },
  5 * 1000);
});


// Калькулятор с валидацией

router.get('/calc', (req, res) => {
  const {a, b, operator} = req.query;
  const lacks = [a, b, operator].some(i =>
    i === undefined
  );

  if (lacks === true) {
    res.status(204).end(`Lack of parameters`);
    return;
  }

  const calc = new Calculator(a, b);

  if (calc.validate() === false) {
    res.status(206).end(
      `Instead of a string number, or a fractional number`
    );
    return;
  }

  if (calc.hasOwnOperator(operator) === false) {
    res.status(206).end(`Invalid operator`);
    return;
  }

  res.send(calc[operator]());
});


// Отсечка нагрузки на калькулятор
// curl -X POST "localhost:8080/calc_ddos" -d '{"a":1,"b":2,"operator":"plus"}' -H 'Content-Type: application/json'

router.post('/calc_ddos', (req, res) => {
  if (throttle.touch(10 * 1000) > 5) {
    res.status(503);
    return;
  }

  const {a, b, operator} = req.body;
  const lacks = [a, b, operator].some(i =>
    i === undefined
  );

  if (lacks === true) {
    res.status(204).end(`Lack of parameters`);
    return;
  }

  const calc = new Calculator(a, b);

  if (calc.validate() === false) {
    res.status(206).end(
      `Instead of a string number, or a fractional number`
    );
    return;
  }

  if (calc.hasOwnOperator(operator) === false) {
    this.res.status(206).end(`Invalid operator`);
    return;
  }

  const selector = `${a}${b}${operator}`;

  req.app.locals.redis.get(selector, (err, reply) => {
    if (err) {
      res.status(500).end();
      return;
    }

    if (reply === null) {
      reply = calc[operator]();
      reply = reply.toString();

      req.app.locals.redis.set(selector, reply);
    }

    res.send(reply);
  });
});


// Одноразовый читатель файлов

router.get('/read_once', (req, res) => {
  let {file} = req.query;

  if (file === undefined) {
    res.status(400).end();
    return;
  }

  const src = `${process.cwd()}/content/${file}`;

  fs.access(src, { mode: fs.constants.R_OK }, (err) => {
    if (err) {
      res.status(404).end();
      return;
    }

    const rs = fs.createReadStream();

    rs.on('close', () => {
      fs.unlink(src);
    });

    rs.pipe(res);
  });
});

module.exports = router;
