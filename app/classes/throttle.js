class Throttle {
  constructor() {
    this.reduce = 0;
  }

  touch(time) {
    this.reduce++;

    setTimeout(() => {
      this.reduce--;
    },
    time);

    return this.reduce;
  }
}

module.exports = Throttle;
