(function() {
  'Use strict';

  var express = require('express'),
    //creating an instance of express
    app = express(),

    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    routes = require('./../app/routes/index'),

  //mounting an instance of the express router on the routes
  router = express.Router();
    routes(router);

  app.use(methodOverride());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(morgan('dev'));

  //creating a test route
  app.get('/', function(req, res) {
    res.send({
      text: 'You have successfully reached the test route',
      code: 200
    });
  });

  //mounting the router on a /api directory
  app.use('/api', router);

  //exporting app
  module.exports = app;
})();
