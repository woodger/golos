const {Router} = require('express');
const ControllerCalculator = require('./controllers/calculator');
const Cookies = require('./models/cookies');

const router = Router();


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
  let calc = new ControllerCalculator(req, res);

  calc.get(req.query);
});


// Отсечка нагрузки на калькулятор

router.post('/calc_ddos', (req, res) => {
  let calc = new ControllerCalculator(req, res);

  calc.get(req.body);
});

module.exports = router;
