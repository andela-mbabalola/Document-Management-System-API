var config = require("./../../config/config"),
  jwt = require("jsonwebtoken"),
  adminConfig = require("./../../config/adminConfig");

/**
 * [function description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.authMiddleware = function(req, res, next) {
  //check header, url parameters or post parameters for token
  var token = req.body.token ||
              req.query.token || req.headers["x-access-token"];
  //decoding token
  if (token) {
    //verify secret and check exp
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: "Failed to authenticate token"
        });
      } else {
        //if everything is good
        req.decoded = decoded;
        next();
      }
    });
  } else {
    //if no token is found
    return res.status(403).send({
      success: false,
      message: "No token provided"
    });
  }
};

/**
 * [function description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.verifyAdmin = function(req, res, next) {
  if (req.params.userName !== adminConfig.adminName) {
    res.json({
      success: false,
      message: "Access denied!"
    });
  } else {
    next();
  }
};
