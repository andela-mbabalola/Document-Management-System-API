(function() {
  'Use strict';

  var documentController = require('./../controllers/document.controllers'),
    auth = require('./../middlewares/auth'),
    userAccess = require('./../middlewares/userAccess');

  function docRoute(router) {

    //mounting the authMiddleware on all the routess
    router.all('/*', auth.authMiddleware);

    //route to create a new document
    router.route('/documents')
      .post(documentController.createDocument);

    //route to get all available documents
    router.route('/documents')
      .get(documentController.getAllDocument);

    //route to get all documents with a specified limit
    router.route('/documents/limit/:limit')
      .get(documentController.getAllDocument);

    //route to get all documents with a specific role
    router.route('/documents/role/:role/:limit')
      .get(documentController.getDocumentByRole);

      //route to get all documents for a specific user
    router.route('/documents/user/:ownerId')
      .get(documentController.getDocumentByUser);

      //route to get a document with its Id
    router.route('/documents/:id')
      .get(documentController.getADocument);

      //mounting the userAccess middleware
    //router.all('/*', userAccess.userAccess);

    //router to edit and delete a document with a specific Id
    router.route('/documents/:id')
      .put(userAccess.userAccess, documentController.editDocument)
      .delete(userAccess.userAccess, documentController.deleteDocument);

  }
  //exporting all routes
  module.exports = docRoute;

})();
