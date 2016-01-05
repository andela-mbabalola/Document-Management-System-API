(function() {
  "Use strict";

  var User = require("./../models/user.models.js"),
    Role = require("./../models/role.models.js"),
    config = require("./../../config/config"),
    jwt = require("jsonwebtoken"),
    helpers = require("./../helpers/helper");

  /**
   * [function to login a valid user]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [success message that user has been logged in]
   */
  exports.login = function(req, res) {
    //checking if the user exists
    User.findOne({
      userName: req.body.userName
    }, function(err, user) {
      if (err) {
        res.send(err);
      } else {
        //if user is not found
        if (!user) {
          res.status(404).json({
            success: false,
            message: "Authentication failed. User not found"
          });
        } else if (user) {
          //check if password matches

          if (helpers.comparePassword(req.body.password, user.password)) {
            //if user was found and password matches
            //create a token
            var token = jwt.sign(user, config.secret, {
              expiresInMinutes: 1440
            });

            res.status(200).json({
              success: true,
              message: "Successfully logged in",
              token: token
            });
          } else {
            res.status(404).json({
              success: false,
              message: "Authentication failed. Wrong password"
            });

          }
        }
      }
    });
  };

  /**
   * [function to create a new user]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [success message that user has been created]
   */
  exports.createUser = function(req, res) {
    //check if role exists
    Role.findOne({
      title: req.body.role
    }, function(err, role) {
      if (err) {
        res.send(err);
      }
      //if role does not exist
      if (!role) {
        res.status(404).json({
          success: false,
          message: "Role not found. Create first"
        });
      } else {
        //check if user exists
        User.findOne({
          userName: req.body.userName
        }, function(err, user) {
          if (err) {
            res.send(err);
          }
          //if a user is found
          if (user) {
            res.status(401).json({
              success: false,
              message: "User already exists!"
            });
          } else {
            //ensuring all the parameters are entered before creating
            if (!req.body.firstName && !req.body.lastName) {
              res.status(403).send({
                success: false,
                message: "Please enter your firstName and lastName"
              });
            } else if (!req.body.userName) {
              res.status(403).send({
                success: false,
                message: "Please enter your userName"
              });
            } else if (!req.body.password) {
              res.status(403).send({
                success: false,
                message: "Please enter your password"
              });
            } else if (!req.body.email) {
              res.status(403).send({
                success: false,
                message: "Please enter your email"
              });
            } else if (!req.body.role) {
              res.status(403).send({
                success: false,
                message: "Please enter your role"
              });
            } else {
              var newUser = new User({
                name: {
                  firstName: req.body.firstName,
                  lastName: req.body.lastName
                },
                userName: req.body.userName,
                password: req.body.password,
                email: req.body.email,
                role: role
              });
              //createa new user
              newUser.save(function(err) {
                if (err) {
                  res.send(err);
                } else {
                  res.status(200).send({
                    success: true,
                    message: "User Successfully created!"
                  });
                }
              });
            }
          }
        });
      }
    });
  };

  /**
   * [function to get all the users in the database]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [all users available in the database]
   */
  exports.getAllUsers = function(req, res) {
    //search for all the users
    User.find({}).exec(function(err, users) {
      if (err) {
        res.send(err);
        //if no user is found
      } else if (!users) {
        res.status(404).send({
          success: false,
          message: "There are currently no users"
        });
      } else {
        //if users are found
        res.status(200).send(users);
      }
    });
  };

  /**
   * [function to get a user by its Id]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [user with specific Id]
   */
  exports.getUserById = function(req, res) {
    //search for a user with a specific Id
    User.findById(req.params.id, function(err, user) {
      if (err) {
        res.send(err);
        //if no user is found
      } else if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found!"
        });
      } else {
        //if a user is found
        res.status(200).json(user);
      }
    });
  };

  /**
   * [function to update a user's details]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [success message that user has been updated]
   */
  exports.updateUser = function(req, res) {
    req.body.name = {
      firstName: req.body.firstName,
      lastName: req.body.lastName
    };

    //check if role exists
    Role.findOne({
      title: req.body.role
    }, function(err, role) {
      if (err) {
        res.send(err);
        //if role is not found
      } else if (!role) {
        res.status(404).json({
          success: false,
          message: "Role does not exist, create first"
        });
      } else {
        req.body.role = role;
        //find user and update its details
        User.findByIdAndUpdate(
          req.params.id, req.body,
          function(err, user) {
            if (err) {
              res.send(err);
              //if user is not found
            } else if (!user) {
              res.status(404).json({
                success: false,
                message: "User does not exist"
              });
            } else {
              res.status(200).json({
                success: true,
                message: "User Successfully updated!"
              });
            }
          });
      }
    });
  };

  /**
   * [function to delete a user]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [success message that user has been deleted]
   */
  exports.deleteUser = function(req, res) {
    //find a user and delete
    User.findByIdAndRemove(req.params.id, function(err, user) {
      if (err) {
        res.send(err);
        //if user is not found
      } else if (!user) {
        res.status(404).json({
          success: false,
          message: "User does not exist!"
        });
      } else {
        res.status(200).json({
          success: true,
          message: "User successfully deleted!"
        });
      }
    });
  };

  /**
   * [function to find a user by documents he/she has]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [documents the user has]
   */
  exports.findUserByDocs = function(req, res) {
    Document.find({
      ownerId: req.params.id
    }, function(err, docs) {
      if (err) {
        res.send(err);
      } else if (!docs) {
        res.status(404).send({
          success: false,
          message: "Documents not found"
        });
      } else {
        res.json(docs);
      }
    });
  };

})();
