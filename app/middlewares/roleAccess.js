(function() {
  'Use strict';

  var config = require('./../../config/adminConfig'),
    Role = require('./../models/role.models');

  /**
   * [function description]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @param  {Function} next [pass control to the next handler]
   * @return {[json]}        [message that permission has been denied]
   */
  exports.roleAccess = function(req, res, next) {
    //check if the role equals that of the superAdministrator
    if (req.body.title === config.role) {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    } else {
      next();
    }
  };

  /**
   * [function description]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @param  {Function} next [pass control to the next handler]
   * @return {[json]}        [message that permission has been denied]
   */
  exports.roleAuth = function(req, res, next) {
    Role.findOne(req.params.id, function(err, role) {
      if (err) {
        res.send(err);
      } else if (!role) {
        res.status(404).json({
          success: false,
          message: 'Role not found'
        });
      } else {
        console.log(req.decoded);
        if (role.title !== config.role) {
          res.status(403).json({
            success: false,
            message: 'Access denied'
          });
        } else {
          next();
        }
      }
    });
  };
})();
