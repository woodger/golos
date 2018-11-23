class Cookies {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  get(key) {
    return req.cookies[key];
  }

  set(key, value = '') {
    res.cookie(key, value, {
      httpOnly: true
    });
  }

  delete(key) {
    res.cookie(key, '', {
      expires: new Date(0),
      httpOnly: true
    });
  }
}

module.exports = Cookies;
