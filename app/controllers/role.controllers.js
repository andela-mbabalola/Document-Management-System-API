(function() {
  'Use strict';

  var Role = require('./../models/role.models');

  /**
   * [function to create a role]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [success message that role has been created]
   */
  exports.createRole = function(req, res) {
    //check if role already exists
    Role.findOne({
      title: req.body.title
    }, function(err, role) {
      if (err) {
        res.send(err);
      } else {
        //if role exists
        if (role) {
          res.status(409).json({
            success: false,
            message: 'Role already exists!'
          });
        } else {
          var newRole = new Role({
            title: req.body.title
          });
          //create a new role
          newRole.save(function(err) {
            if (err) {
              res.send(err);
            } else {
              res.json({
                success: true,
                message: 'Role successfully created!'
              });
            }
          });
        }
      }
    });
  };

  /**
   * [function to get all available roles]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [all available roles in the database]
   */
  exports.getAllRoles = function(req, res) {
    //find all available roles
    Role.find({}, function(err, roles) {
      if (err) {
        res.send(err);
        //if no role is found
      } else if (roles.length === 0) {
        res.json({
          success: false,
          message: 'There are currently no roles'
        });
      } else {
        res.json(roles);
      }
    });
  };

  /**
   * [function to get a specific role by it Id]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [a role with a specific Id]
   */
  exports.getRoleById = function(req, res) {
    Role.findById(req.params.id, function(err, role) {
      if (err) {
        res.send(err);
      } else if (!role) {
        res.status(404).json({
          success: false,
          message: 'Role not found!'
        });
      } else {
        res.json({
          success: true,
          message: role
        });
      }
    });
  };

  /**
   * [function to edit a role's detail]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [success message that role has been updated]
   */
  exports.editRole = function(req, res) {
    //find a role with its Id and update its content
    Role.findByIdAndUpdate(req.params.id, req.body, function(err, role) {
      if (err) {
        res.json({
          success: false,
          message: 'Update role failed!'
        });
        //if no role is found
      } else if (!role) {
        res.status(404).json({
          success: false,
          message: 'Role not found'
        });
      } else {
        res.json({
          success: true,
          message: 'Role successfully updated'
        });
      }
    });
  };

  /**
   * [function to delete a role]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @return {[json]}     [success message that role has been deleted]
   */
  exports.deleteRole = function(req, res) {
    //find a role with its Id and delete
    Role.findById(req.params.id).remove(function(err, role) {
      if (err) {
        res.json({
          success: false,
          message: 'Delete role failed'
        });
        //if no role is found
      } else if (!role) {
        res.status(404).json({
          success: false,
          message: 'Role does not exist!'
        });
      } else {
        res.json({
          success: true,
          message: 'Role successfully deleted'
        });
      }
    });
  };

})();
