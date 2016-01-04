(function () {
  'Use strict';

  var documentController = require('./../controllers/document.controllers'),
    auth = require('./../middlewares/auth'),
    userAccess = require('./../middlewares/userAccess');

  function docRoute(router) {

    router.all('/*', auth.authMiddleware);

    router.route('/documents')
      .post(documentController.createDocument);

    router.route('/documents')
      .get(documentController.getAllDocument);

    router.route('/documents/limit/:limit')
      .get(documentController.getAllDocument);

    router.route('/documents/role/:role/:limit')
      .get(documentController.getDocumentByRole);

    router.route('/documents/user/:ownerId')
      .get(documentController.getDocumentByUser);

    router.route('/documents/:id')
      .get(documentController.getADocument);

    router.all('/*', userAccess.userAccess);

    router.route('/documents/:id')
      .put(documentController.editDocument)
      .delete(documentController.deleteDocument);

  }
  module.exports = docRoute;

})();
