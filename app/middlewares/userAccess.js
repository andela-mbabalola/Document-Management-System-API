(function() {
  'Use strict';

  var documents = require('./../models/document.models'),
    config = require('./../../config/adminConfig');

  exports.userAccess = function(req, res, next) {
    documents.findOne(req.params.id, function(err, doc) {
      if (err) {
        res.send(err);
      } else if (!doc) {
        res.status(404).json({
          success: false,
          message: 'Doc not found'
        });
      } else {
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
