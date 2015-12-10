var roleController = require('./../controllers/role.controllers'),
  auth = require('./../middlewares/auth');

function roleRoute(router) {

  router.all('/*', auth.authMiddleware);

  router.route('/superAdministrator/:id')
    .put(roleController.editRole)
    .delete(roleController.deleteRole);

  router.route('/superAdministrator/:userName')
    .post(auth.verifyAdmin, roleController.createRole)
    .get(auth.verifyAdmin, roleController.getAllRoles);

}
module.exports = roleRoute;
