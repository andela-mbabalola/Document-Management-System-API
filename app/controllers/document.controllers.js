(function() {
  "Use strict";


  var User = require("./../models/user.models.js"),
    Role = require("./../models/role.models.js"),
    Documents = require("./../models/document.models.js");

  /**
   * [function to create a document]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [success message that document has been created]
   */
  exports.createDocument = function(req, res) {
    Role.findOne({
      title: req.body.role
    }, function(err, role) {
      if (err) {
        res.send(err);
      } else {
        if (!role) {
          res.status(403).json({
            success: false,
            message: "Role not found. Create first!"
          });
        } else {
          User.findOne({
            userName: req.body.ownerId
          }, function(err, user) {
            if (err) {
              res.send(err);
            } else {
              if (!user) {
                res.json({
                  success: false,
                  message: "User not found. Create first"
                });
              } else {
                Documents.findOne({
                  title: req.body.title
                }, function(err, document) {
                  if (err) {
                    res.send(err);
                  } else {
                    if (document) {
                      res.json({
                        success: false,
                        message: "Document already exists!"
                      });
                    } else {
                      var newDoc = new Documents({
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
        }
      }
    });
  };

  /**
   * [function to return all available documents]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [all documents available in the database]
   */
  exports.getAllDocument = function(req, res) {
    Documents.find({})
      .limit(parseInt(req.params.limit))
      .exec(function(err, docs) {
        if (err) {
          res.send(err);
        } else if (!docs) {
          res.json({
            success: false,
            message: "No document available"
          });
        } else {
          res.json({
            success: true,
            message: docs
          });
        }

      });
  };

  /**
   * [function to get a document]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [document with a specific Id]
   */
  exports.getADocument = function(req, res) {
    Documents.findById(req.params.id, function(err, doc) {
      if (err) {
        res.send(err);
      } else if (!doc) {
        res.status(404).json({
          success: false,
          message: "Document not found"
        });
      } else {
        res.json(doc);
      }
    });
  };

  /**
   * [function to get a document by its role]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [document created by a specific role]
   */

  exports.getDocumentByRole = function(req, res) {
    Documents.find({
        role: req.params.role
      })
      .limit(parseInt(req.params.limit))
      .exec(function(err, doc) {
        if (err) {
          res.send(err);
        } else if (!doc) {
          res.json({
            success: false,
            message: "Role has no document"
          });
        } else {
          res.json(doc);
        }
      });
  };

  /**
   * [function to get documents that belongs to  user]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [document created by a specific user]
   */

  exports.getDocumentByUser = function(req, res) {
    Documents.find({
        ownerId: req.params.ownerId
      })
      .limit(parseInt(req.params.limit))
      .exec(function(err, doc) {
        if (err) {
          res.send(err);
        } else if (doc.length < 1) {
          res.status(404).json({
            success: false,
            message: "User has no document"
          });
        } else {
          res.json(doc);
        }
      });
  };

  /**
   * [function to update a document]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [success message that document has been updated]
   */
  exports.editDocument = function(req, res) {
    Documents.findByIdAndUpdate(
      req.params.id, req.body,
      function(err, document) {
        if (err) {
          res.send(err);
        } else if (!document) {
          res.json({
            success: false,
            message: "Document does not exist"
          });
        } else {
          res.json({
            success: true,
            message: "Document Successfully updated!"
          });
        }
      });
  };

  /**
   * [function to delete a document]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [success message that document has been deleted]
   */
  exports.deleteDocument = function(req, res) {
    Documents.findByIdAndRemove(req.params.id, function(err, document) {
      if (err) {
        res.send(err);
      } else if (!document) {
        res.status(404).json({
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

})();
