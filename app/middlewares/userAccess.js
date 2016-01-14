(function() {
  'Use strict';

  var documents = require('./../models/document.models.js'),
    config = require('./../../config/adminConfig.js');

  /**
   * [function description]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @param  {Function} next [pass control to the next handler]
   * @return {[json]}        [message that permission has been denied]
   */

  exports.userAccess = function(req, res, next) {
    documents.findOne(req.params.id, function(err, doc) {
      if (err) {
        res.send(err);
      } else if (!doc) {
        res.status(404).json({
          success: false,
          message: 'Docs not found'
        });
      } else {
        console.log('here' + req.decoded._id);
        if (req.decoded._id !== doc.ownerId.toString() &&
          req.decoded.role !== config.role &&
          req.decoded.role !== doc.role.toString()) {
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
