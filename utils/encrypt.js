const bcrypt = require("bcrypt");

module.exports = class PasswordHash {
  constructor(hash) {
    this.hash = hash;
  }

  static hash(password) {
    return bcrypt.genSalt(10).then((salt) => bcrypt.hash(password, salt));
  }

  async compare(password) {
    return bcrypt.compare(password, this.hash);
  }
};
