(function() {
  'Use strict';

  var bcrypt = require('bcrypt');

  /**
   * [function to encrypt a password and compare with another]
   * @param  {[String]} password       [password to be compared with]
   * @param  {[String]} hashedPassword [encrypted password to be decrypted]
   * @return {[boolean]}                [if passwords are the same or not]
   */
  exports.comparePassword = function(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  };
})();
