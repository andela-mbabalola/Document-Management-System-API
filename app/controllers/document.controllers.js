(function() {
  'Use strict';


  var User = require('./../models/user.models.js'),
    Role = require('./../models/role.models.js'),
    Documents = require('./../models/document.models.js');

  /**
   * [function to create a document]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [success message that document has been created]
   */
  exports.createDocument = function(req, res) {
    //check if role exists
    Role.findOne({
      title: req.body.role
    }, function(err, role) {
      if (err) {
        res.send(err);
      } else {
        //if role is not found
        if (!role) {
          res.status(404).json({
            success: false,
            message: 'Role not found. Create first!'
          });
        } else {
          //check if user exists
          User.findOne({
            userName: req.body.ownerId
          }, function(err, user) {
            if (err) {
              res.send(err);
            } else {
              //if no user is found
              if (!user) {
                res.status(404).json({
                  success: false,
                  message: 'User not found. Create first'
                });
              } else {
                //check if document already exists
                Documents.findOne({
                  title: req.body.title
                }, function(err, document) {
                  if (err) {
                    res.send(err);
                  } else {
                    //if a document is found
                    if (document) {
                      res.status(409).json({
                        success: false,
                        message: 'Document already exists!'
                      });
                    } else {
                      var newDoc = new Documents({
                        title: req.body.title,
                        content: req.body.content,
                        ownerId: user.id,
                        role: role
                      });
                      //create a new document
                      newDoc.save(function(err) {
                        if (err) {
                          res.send(err);
                        } else {
                          res.json({
                            success: true,
                            message: 'Document successfully created'
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
    //find all available document(s)
    Documents.find({})
    //parsing the limit
      .limit(parseInt(req.params.limit))
      .exec(function(err, docs) {
        if (err) {
          res.send(err);
          //if no document is found
        } else if (!docs) {
          res.status(404).json({
            success: false,
            message: 'No document available'
          });
        } else {
          res.status(200).json(docs);
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
    //find a document with a specific id
    Documents.findById(req.params.id, function(err, doc) {
      if (err) {
        res.send(err);
        //if no document is found
      } else if (!doc) {
        res.status(404).json({
          success: false,
          message: 'Document not found'
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
    //find documents with a specific role
    Documents.find({
        role: req.params.role
      })
      //parsing the limit
      .limit(parseInt(req.params.limit))
      .exec(function(err, doc) {
        if (err) {
          res.send(err);
          //if no document is found
        } else if (!doc) {
          res.status(404).json({
            success: false,
            message: 'Role has no document'
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
    //find documents with a specific user
    Documents.find({
        ownerId: req.params.ownerId
      })
      //parsing the limit
      .limit(parseInt(req.params.limit))
      .exec(function(err, doc) {
        if (err) {
          res.send(err);
          //if no document is found
        } else if (doc.length < 1) {
          res.status(404).json({
            success: false,
            message: 'User has no document'
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
    //find a document with a specific Id and update
    Documents.findByIdAndUpdate(
      req.params.id, req.body,
      function(err, document) {
        if (err) {
          res.send(err);
          //if no document is found
        } else if (!document) {
          res.status(404).json({
            success: false,
            message: 'Document does not exist'
          });
        } else {
          res.json({
            success: true,
            message: 'Document Successfully updated!'
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
    //find a document with a specific Id and delete it
    Documents.findByIdAndRemove(req.params.id, function(err, document) {
      if (err) {
        res.send(err);
        //if no document is found
      } else if (!document) {
        res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Document successfully deleted'
        });
      }
    });
  };

})();
