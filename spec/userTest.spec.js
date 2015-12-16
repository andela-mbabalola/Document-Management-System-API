var jwt = require("jsonwebtoken"),
  fs = require("fs"),
  expect = require("expect.js"),
  server = require("./../server.js"),
  request = require("supertest")(server),
  user = require("./../app/models/user.models"),
  role = require("./../app/models/role.models"),
  config = require("./../config/config"),
  userSeeders = fs.readFileSync(__dirname + "/../seeders/user.seeders.json"),
  roleSeeders = fs.readFileSync(__dirname + "/../seeders/role.seeders.json"),

  _userSeeders = JSON.parse(userSeeders),
  _roleSeeders = JSON.parse(roleSeeders);

describe("Users", function() {
  describe("/POST: Validate user login", function() {
    before(function(done) {
      var testRole = new role(_roleSeeders[0]);
      testRole.save();
      // Update existing role string with the new found role object
      _userSeeders[0].role = testRole._id;
      var testUser = new user(_userSeeders[0]);
      testUser.save();
      console.log("Created");
      done();
    });

    after(function(done) {
      user.remove({}, function() {
        role.remove({}, function() {
          done();
        });
      });
    });

    it("should connect to root", function(done) {
      request.get("/")
        .expect(200);
      done();
    });

    it("should verify that user logs in with correct password", function(done) {
      request.post("/api/users/login")
        .send({
          userName: _userSeeders[0].userName,
          password: "me"
        }).end(function(err, res) {
          console.log(res.body);
          expect(res.body.success).to.eql(false);
          expect(res.body.message).to.eql("Authentication failed. Wrong password");
          done();
        });
    });

    it("should verify that user logs in with correct userName", function(done) {
      request.post("/api/users/login")
        .send({
          userName: "myName",
          password: _userSeeders[0].password
        }).end(function(err, res) {
          console.log(res.body);

          expect(res.body.success).to.eql(false);
          expect(res.body.message).to.eql("Authentication failed. User not found");

          done();
        });
    });

    it("should login new users", function(done) {
      request.post("/api/users/login")
        .send({
          userName: _userSeeders[0].userName,
          password: _userSeeders[0].password
        }).end(function(err, res) {
          console.log(res.body.success);

          expect(res.body.success).to.eql(true);
          expect(res.body.message).to.eql("Successfully logged in");
          expect(res.body.message).to.not.be.empty();


          done();
        });
    });
  });

  describe("/POST: Create new users", function() {
    before(function(done) {
      var testRole = new role(_roleSeeders[1]);
      testRole.save();
      // Update existing role string with the new found role object
      _userSeeders[1].role[0] = testRole._id;
      var testUser = new user(_userSeeders[1]);
      testUser.save();
      done();
    });


    after(function(done) {
      user.remove({}, function() {
        role.remove({}, function() {
          done();
        });
      });
    });

    it("create a new user", function(done) {
      request.post("/api/users")
        .set("Accept", "x-www-form-urlencoded")
        .send({
          firstName: _userSeeders[1].name.firstName,
          lastName: _userSeeders[1].name.lastName,
          userName: _userSeeders[1].userName,
          password: _userSeeders[1].password,
          email: _userSeeders[1].email,
          role: _userSeeders[1].role
        }).end(function(err, res) {

          expect(res.body.success).to.eql(true);
          expect(res.body.message).to.eql("User Successfully created!");

          done();
        });
    });

    it("Does not create a user without a role", function(done) {
      request.post("/api/users")
        .send({
          firstName: _userSeeders[1].name.firstName,
          lastName: _userSeeders[1].name.lastName,
          userName: _userSeeders[1].userName,
          password: _userSeeders[1].password,
          email: _userSeeders[1].email,
          role: "Owner" || undefined
        }).end(function(err, res) {

          expect(res.body.success).to.eql(false);
          expect(res.body.message).to.eql("Role not found. Create first");

          done();
        });
    });

    it("checks for before creating firstName and lastName", function(done) {
      request.post("/api/users")
        .send({
          userName: _userSeeders[1].userName,
          password: _userSeeders[1].password,
          email: _userSeeders[1].email,
          role: _userSeeders[1].role
        }).end(function(err, res) {
          console.log(res.body.message);

          expect(res.body.message).to.eql("User validation failed");
          expect(res.body.errors).to.not.be.empty();

          done();
        });
    });

  });


});
