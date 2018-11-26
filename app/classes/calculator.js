class Calculator {
  constructor(a, b) {
    this.a = Number(a);
    this.b = Number(b);
    this.actions = ['plus', 'minus', 'div', 'mul'];
  }

  validate() {
    let set = [this.a, this.b];

    Object.keys(set).forEach(i => {
      let item = set[i];

      if (Number.isNaN(item) || (item ^ 0) !== item) {
        return false;
      }
    });

    return true;
  }

  hasOwnOperator(operator) {
    return this.actions.includes(operator);
  }

  plus() {
    return this.a + this.b;
  }

  minus() {
    return this.a - this.b;
  }

  div() {
    return this.a / this.b;
  }

  mul() {
    return this.a * this.b;
  }
}

module.exports = Calculator;
