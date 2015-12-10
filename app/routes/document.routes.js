var documentController = require('./../controllers/document.controllers'),
  auth = require('./../middlewares/auth');

function docRoute(router) {

  router.route('/documents')
    .post(documentController.createDocument);

  router.all('/*', auth.authMiddleware);

  router.route('/documents')
    .get(documentController.getAllDocument);

  router.route('/documents/:id')
    .get(documentController.getADocument)
    .put(documentController.editDocument)
    .delete(documentController.deleteDocument);

}
module.exports = docRoute;
