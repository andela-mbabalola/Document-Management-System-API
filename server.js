var app = require('./app/config/appConfig'),
  mongoose = require('mongoose'),
  db = require('./app/config/database'),
  app = require('./app/config/appConfig'),

  port = process.env.PORT || 4444;


// configuration ===============================================================
mongoose.connect(db.url); // connect to database

app.listen(port);
console.log("Successfully connected to port " + port);
