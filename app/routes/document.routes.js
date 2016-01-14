(function() {
  'Use strict';

  var documentController = require('./../controllers/document.controllers'),
    auth = require('./../middlewares/auth'),
    userAccess = require('./../middlewares/userAccess');

  function docRoute(router) {

    //route to create a new document
    router.route('/documents')
      .post(auth.authMiddleware, documentController.createDocument);

    //route to get all available documents
    router.route('/documents')
      .get(auth.authMiddleware, documentController.getAllDocument);

    //route to get all documents with a specified limit
    router.route('/documents?limit=:limit')
      .get(auth.authMiddleware, documentController.getAllDocument);

    //route to get all documents with a specific role
    router.route('/documents/role/:role/:limit')
      .get(auth.authMiddleware, documentController.getDocumentByRole);

    //route to get all documents for a specific user
    router.route('/user/:ownerId/documents/')
      .get(auth.authMiddleware, documentController.getDocumentByUser);

    //route to get a document with its Id
    router.route('/documents/:id')
      .get(auth.authMiddleware, documentController.getADocument);

    //mounting the userAccess middleware
    //router.all('/*', userAccess.userAccess);

    //router to edit and delete a document with a specific Id
    router.route('/documents/:id')
      .put(auth.authMiddleware, userAccess.userAccess, documentController.editDocument)
      .delete(auth.authMiddleware, userAccess.userAccess, documentController.deleteDocument);

    router.route('/documents/title/:title/:id')
      .put(auth.authMiddleware, userAccess.userAccess,
        documentController.editDocument)
      .delete(auth.authMiddleware, userAccess.userAccess,
        documentController.deleteDocument);
  }
  //exporting all routes
  module.exports = docRoute;
})();
