var bcrypt = require('bcrypt');

exports.comparePassword = function(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
};
