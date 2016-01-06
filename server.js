(function() {
  'Use strict';

var app = require('./config/appConfig'),
  mongoose = require('mongoose'),
  db = require('./config/database'),

  port = process.env.PORT || 4444;


// configuration ===============================================================
mongoose.connect(db.url); // connect to database

 app.listen(port);
console.log('Successfully connected to port ' + port);

module.exports = app;

})();
