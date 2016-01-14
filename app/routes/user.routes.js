(function() {
  'Use strict';

  var userController = require('./../controllers/user.controllers'),
    auth = require('./../middlewares/auth');

  function userRoute(router) {

    //route to login a user
    router.route('/users/login')
      .post(userController.login);

    //route to create a new user
    router.route('/users')
      .post(userController.createUser);

    //route to get all available user(s)
    router.route('/users')
      .get(auth.authMiddleware, userController.getAllUsers);

    //route to get, edit and delete a user specified by its Id
    router.route('/users/:id')
      .get(auth.authMiddleware, userController.getUserById)
      .put(auth.authMiddleware, userController.updateUser)
      .delete(auth.authMiddleware, userController.deleteUser);

  }
  //exporting all available routes
  module.exports = userRoute;

})();
