var express = require("express"),
  app = express(),
  router = express.Router(),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  methodOverride = require("method-override"),
  routes = require("./../app/routes/index");

routes(router);

app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan("dev"));

app.get("/", function(req, res) {
  res.send({
    text: "You have successfully reached the test route",
    code: 200
  });
});

app.use("/api", router);

module.exports = app;
