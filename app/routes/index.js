(function() {
  'Use strict';

  var _userRoute = require('./user.routes'),
    _documentRoute = require('./document.routes'),
    _roleRoute = require('./role.routes');

  var routes = function(router) {
    _userRoute(router);
    _documentRoute(router);
    _roleRoute(router);
  };
  module.exports = routes;

})();
