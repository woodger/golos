const calculator = require('../models/calculator');

class ControllerCalculator {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  get({a, b, operator}) {
    let lacks = [a, b, operator].some(i => {
      return i === undefined;
    });

    if (lacks === true) {
      this.res.status(204).end(`Lack of parameters`);
      return;
    }

    let values = {
      a: Number(a),
      b: Number(b)
    };

    for (let i in values) {
      let item = values[i];

      if (Number.isNaN(item) || (item ^ 0) !== item) {
        this.res.status(206).end(
          `Instead of a string number, or a fractional number`
        );
        return;
      }
    }

    let action = calculator[operator];

    if (typeof action !== 'function') {
      this.res.status(206).end(`Invalid operator`);
      return;
    }

    this.res.send(action(a, b));
  }
};

module.exports = ControllerCalculator;
