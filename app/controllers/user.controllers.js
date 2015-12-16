var User = require("./../models/user.models.js"),
  Role = require("./../models/role.models.js"),
  config = require("./../../config/config"),
  jwt = require("jsonwebtoken"),
  helpers = require("./../helpers/helper");

/**
 * [function description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.login = function(req, res) {
  if (req.headers){ return "junit";}
  User.findOne({
    userName: req.body.userName,
  }, function(err, user) {
    if (err) {
      res.send(err);
    } else {
      if (!user) {
        res.json({
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

          res.json({
            success: true,
            message: "Successfully logged in",
            token: token
          });
        } else {
          res.json({
            success: false,
            message: "Authentication failed. Wrong password"
          });

        }
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
exports.createUser = function(req, res) {
  Role.findOne({
    title: req.body.role
  }, function(err, role) {
    if (err) {
      res.send(err);
    }
    if (!role) {
      res.json({
        success: false,
        message: "Role not found. Create first"
      });
    } else {
      User.findOne({
        userName: req.body.userName
      }, function(err, user) {
        if (err) {
          res.send(err);
        }
        if (user) {
          res.json({
            success: false,
            message: "User already exists!"
          });
        } else {
          if (!req.body.firstName && !req.body.lastName) {
            res.status(403).send({
              success: false,
              message: "Please enter your firstName and lastName"
            });
          }
          if (!req.body.userName) {
            res.status(403).send({
              success: false,
              message: "Please enter your userName"
            });
          }
          if (!req.body.password) {
            res.status(403).send({
              success: false,
              message: "Please enter your password"
            });
          }
          if (!req.body.email) {
            res.status(403).send({
              success: false,
              message: "Please enter your email"
            });
          }
          if (!req.body.role) {
            res.status(403).send({
              success: false,
              message: "Please enter your role"
            });
          }
        }

      });
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
      newUser.save(function(err) {
        if (err) {
          res.send(err);
        } else {
          res.send({
            success: true,
            message: "User Successfully created!"
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
exports.getAllUsers = function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      res.send(err);
    } else {
      if (users.length === 0) {
        res.send({
          success: false,
          message: "There are currently no users"
        });
      } else {
        res.send(users);
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
exports.getUserById = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.send(err);
    } else {
      res.json(user);
    }
  });
};

/**
 * [function description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.updateUser = function(req, res) {
  req.body.name = {
    firstName: req.body.firstName,
    lastName: req.body.lastName
  };

  Role.findOne({
    title: req.body.role
  }, function(err, role) {
    if (err) {
      res.send(err);
    } else if (!role) {
      res.json("Role does not exist, create first");
    } else {
      req.body.role = role;
      User.findByIdAndUpdate(
        req.params.id, req.body,
        function(err, user) {
          if (err) {
            res.send(err);
          } else if (!user) {
            res.json({
              message: "User does not exist"
            });
          } else {
            res.json({
              success: true,
              message: "User Successfully updated!"
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
exports.deleteUser = function(req, res) {
  User.findById(req.params.id).remove(function(err, user) {
    if (err) {
      res.send(err);
    } else if (!user) {
      res.json({
        success: false,
        message: "User does not exist"
      });
    } else {
      res.json({
        success: true,
        message: "User Successfully deleted"
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
