var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  fs = require('fs'),
  request = require('supertest')(server),
  server = require('./../server.js'),
  app = require('./../config/appConfig'),
  db = require('./../config/database'),
  config = require('./../config/config.js'),
  user = require('./../app/models/user.models'),
  role = require('./../app/models/role.models'),
  userSeeders = fs.readFileSync(__dirname + '/../seeders/user.seeders.json'),
  roleSeeders = fs.readFileSync(__dirname + '/../seeders/role.seeders.json'),

  _userSeeders = JSON.parse(userSeeders),
  _roleSeeders = JSON.parse(roleSeeders);

describe("Users", function () {
  describe("Validate user login", function () {
    beforeEach(function (done) {
      var testRole = new Role(_roleSeeders[0]);
      testRole.save();
      var testUser = new User(_userSeeders[0]);
      testUser.save();
      done();
    });

    afterEach(function (done) {
      user.remove({}, function () {
        role.remove({}, function () {
          done();
        });
      });
    });

    it("should login new users", function (done) {
      request.post('/api/users/login').send({
        userName : _userSeeders[0].userName,
        password : _userSeeders[0].password
      }).end(function (err, response) {
        expect(res.body).toEqual(jasmine.objectContaining({
          success : true,
          message : 'Successfully logged in'
        }));
        expect(res.body).not.toBeNull();
        expect(res.statusCode).toBe(200);
        expect(err).toBe(null);
      });
    });
  });
});
