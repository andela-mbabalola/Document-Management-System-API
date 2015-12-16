var Role = require("./../models/role.models");

/**
 * [function description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.createRole = function(req, res) {
  Role.findOne({
    title: req.body.title
  }, function(err, role) {
    if (err) {
      res.send(err);
    } else {
      if (role) {
        res.json({
          success: false,
          message: "Role already exists!"
        });
      } else {
        var newRole = new Role({
          title: req.body.title
        });
        newRole.save(function(err) {
          if (err) {
            res.send(err);
          } else {
            res.json({
              success: true,
              message: "Role successfully created!"
            });
          }
        });
      }
    }
  });
};

exports.getAllRoles = function (req, res) {
  Role.find({}, function (err, roles) {
    if (err) {
      res.send(err);
    } else if (roles.length === 0) {
      res.json({
        success : false, message : "There are currently no roles"
      });
    } else {
      res.json(roles);
    }
  });
};

/**
 * [function description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.editRole = function(req, res) {
  Role.findByIdAndUpdate(req.params.id, req.body, function(err, role) {
    if (err) {
      res.json({
        success: false,
        message: "Update role failed!"
      });
    } else if (!role) {
      res.json({
        success: false,
        message: "Role not found"
      });
    } else {
      res.json({
        success: true,
        message: "Role successfully updated"
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
exports.deleteRole = function(req, res) {
  Role.findById(req.params.id).remove(function(err, role) {
    if (err) {
      res.json({
        success: false,
        message: "Delete role failed"
      });
    } else if (!role) {
      res.json({
        success: false,
        message: "Role does not exist!"
      });
    } else {
      res.json({
        success: true,
        message: "Role successfully deleted"
      });
    }
  });
};
