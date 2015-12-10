var userController = require('./../controllers/user.controllers'),
  auth = require('./../middlewares/auth');

function userRoute(router) {

  router.route('/users/login')
    .post(userController.login);

  router.route('/users')
    .post(userController.createUser);


  router.all('/*', auth.authMiddleware);
  router.route('/users')
    .get(userController.getAllUsers);

  router.route('/users/:id')
    .get(userController.getUserById)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

  router.route('/users/:id/documents')
    .get(userController.findUserByDocs);
}
module.exports = userRoute;
