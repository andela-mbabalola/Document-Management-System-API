var User = require('./../models/user.models.js'),
  Role = require('./../models/role.models.js'),
  Document = require('./../models/document.models.js');

/**
 * [function description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.createDocument = function(req, res) {
  Role.findOne({
    title: req.body.role
  }, function(err, role) {
    if (err) {
      res.send(err);
    } else {
      if (!role) {
        res.json({
          success: false,
          message: "Role does not exist, create first"
        });
      } else {
        User.findOne({
          userName: req.body.userName
        }, function(err, user) {
          if (err) {
            res.send(err);
          } else {
            if (!user) {
              res.json({
                success: false,
                message: "User does not exist. Create first"
              });
            } else {
              var newDoc = new Document({
                title: req.body.title,
                content: req.body.content,
                ownerId: user.id,
                role: role
              });
              newDoc.save(function(err) {
                if (err) {
                  res.send(err);
                } else {
                  res.json({
                    success: true,
                    message: "Document successfully created"
                  });
                }
              });
            }
          }
        });
      }
    }
  });
};

/**
 * [function description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getAllDocument = function(req, res) {
  Document.find({}, function(err, docs) {
    if (err) {
      res.send(err);
    } else {
      if (docs.length === 0) {
        res.json({
          success: false,
          message: "There are currently no documents"
        });
      } else {
        res.json(docs);
      }
    }
  });
};

/**
 * [function description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getADocument = function(req, res) {
  Document.findById(req.params.id, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.json(doc);
    }
  });
};

/**
 * [function description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.editDocument = function(req, res) {
  Role.findOne({
    title: req.body.role
  }, function(err, role) {
    if (err) {
      res.send(err);
    } else if (!role) {
      res.json("Role does not exist, create first");
    } else {
      req.body.role = role;
      User.findOne({
        userName: req.body.userName
      }, function(err, user) {
        if (err) {
          res.send(err);
        } else if (!user) {
          res.json("User does not exist");
        } else {
          req.body.userName = user;
          Document.findByIdAndUpdate(
            req.params.id, req.body,
            function(err, document) {
              if (err) {
                res.send(err);
              } else if (!document) {
                res.json({
                  message: "Document does not exist"
                });
              } else {
                res.json({
                  success: true,
                  message: "Document Successfully updated!"
                });
              }
            });
        }
      });
    }
  });
};

/**
 * [function description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.deleteDocument = function(req, res) {
  Document.findById(req.params.id).remove(function(err, document) {
    if (err) {
      res.send(err);
    } else if (!document) {
      res.json({
        success: false,
        message: "Document not found"
      });
    } else {
      res.json({
        success: true,
        message: "Document successfully deleted"
      });
    }
  });
};
