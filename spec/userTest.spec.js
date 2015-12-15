var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  fs = require('fs'),
  server = require('./../server.js'),
  request = require('supertest')(server),
  user = require('./../app/models/user.models'),
  role = require('./../app/models/role.models'),
  userSeeders = fs.readFileSync(__dirname + '/../seeders/user.seeders.json'),
  roleSeeders = fs.readFileSync(__dirname + '/../seeders/role.seeders.json'),

  _userSeeders = JSON.parse(userSeeders),
  _roleSeeders = JSON.parse(roleSeeders);

describe("Users", function() {
  describe("/POST: Validate user login", function() {  //   beforeEach(function(done) {
      var testRole = new role(_roleSeeders[0]);
      testRole.save();
      // Update existing role string with the new found role object
      _userSeeders[0].role = testRole._id;
      var testUser = new user(_userSeeders[0]);
      testUser.save();
      done();
    });

    afterEach(function(done) {
      user.remove({}, function() {
        role.remove({}, function() {
          done();
        });
      });
    });

    it("should connect to root", function(done) {
      request.get('/')
        .expect(200);
    });

    it("should login new users", function(done) {
      request.post('/api/users/login')
        .send({
          userName: _userSeeders[0].userName,
          password: _userSeeders[0].password
        }).end(function(err, res) {
          expect(res.body).toEqual(jasmine.objectContaining({
            success: true,
            message: 'Successfully logged in'
          }));
          expect(res.body).not.toBeNull();
          expect(res.statusCode).toBe(200);
          expect(err).toBe(null);
          done();
        });
    });

    it("should verify that user logs in with correct userName", function(done) {
      request.post('/api/users/login')
        .send({
          password: 'myName' || undefined,
          userName: _userSeeders[0].password
        }).end(function(err, res) {
          expect(res.body).toEqual(jasmine.objectContaining({
            success: false,
            message: 'Authentication failed. User not found'
          }));
          done();
        });
    });
  
    it("should verify that user logs in with correct password", function(done) {
      request.post('/api/users/login')
        .send({
          userName: _userSeeders[0].userName,
          password: 'myPassword' || undefined
        }).end(function(err, res) {
          expect(res.body).toEqual(jasmine.objectContaining({
            success: false,
            message: 'Authentication failed. Wrong password'
          }));
          done();
        });
    });

  });

  describe("/POST: Create new users", function() {
    beforeEach(function(done) {
      var testRole = new role(_roleSeeders[1]);
      testRole.save();
      // Update existing role string with the new found role object
      _userSeeders[1].role[0] = testRole._id;
      var testUser = new user(_userSeeders[1]);
      testUser.save();
      done();
    });


    afterEach(function(done) {
      user.remove({}, function() {
        role.remove({}, function() {
          done();
        });
      });
    });

    it("create a new user", function(done) {
      request.post('/api/users')
        .set('Accept', 'x-www-form-urlencoded')
        .send({
          firstName: _userSeeders[1].name.firstName,
          lastName: _userSeeders[1].name.lastName,
          userName: _userSeeders[1].userName,
          password: _userSeeders[1].password,
          email: _userSeeders[1].email,
          role: _userSeeders[1].role
        }).end(function(err, res) {
          expect(res.body).toEqual(jasmine.objectContaining({
            success: true,
            message: 'User Successfully created!'
          }));
          expect(err).toBeNull();
          expect(res.statusCode).toBe(200);
          done();
        });
    });

    it("Does not create a user without a role", function(done) {
      request.post('/api/users')
        .send({
          firstName: _userSeeders[1].name.firstName,
          lastName: _userSeeders[1].name.lastName,
          userName: _userSeeders[1].userName,
          password: _userSeeders[1].password,
          email: _userSeeders[1].email,
          role: "Owner" || undefined
        }).end(function(err, res) {
          expect(res.body).toEqual(jasmine.objectContaining({
            success: false,
            message: 'Role not found. Create first'
          }));
          done();
        });
    });

    it("Does not create a user without a firstName and lastName", function(done) {
      request.post('/api/users')
        .send({
          firstName: undefined,
          lastName: undefined,
          userName: _userSeeders[1].userName,
          password: _userSeeders[1].password,
          email: _userSeeders[1].email,
          role: _userSeeders[1].role
        }).end(function(err, res) {
          expect(err).not.toBeNull();
          expect(res.statusCode).not.toBe(200);
        });
      done();
    });

  });

  describe("/GET: Get all users", function () {
    it("returns all the available users in the database", function (done) {

    });
  });

});
