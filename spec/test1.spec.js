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

  var userId,
    userToken;
  describe("/GET: Get all users", function() {

    beforeEach(function(done) {
      role.create(_roleSeeders[2]).then(function(Role) {
        _userSeeders[2].role = Role._id;
        user.create(_userSeeders[2]).then(function(users) {
          userToken = jwt.sign(users, config.secret, {
            expiresInMinutes: 1440
          });
          userId = users._id;
          done();
        }, function(err) {
          console.log(err);
          done();
        });
      }, function(err) {
        console.log(err);
        done();
      });
    });

    afterEach(function(done) {
      user.remove({}).exec(function(err) {
        role.remove({}).exec(function(err) {
          if (err) {
            console.log(err);
          }
          console.log("Removed");
          done();
        });
      });
    });

    it("should return a user when id is specified", function(done) {

      //console.log(userId);
      request.get("/api/users/" + userId)
        .set("x-access-token", userToken)
        .expect(200)
        .end(function(err, res) {
          console.log("here" + res.body);
          // expect(res.body).toEqual(jasmine.objectContaining({
          //   userName : "Bolu",
          //   email : "bolu@gmail.com"
          // }));
          expect(res.body.success).to.eql(true);
          done();
        });
    });

    it("returns all the available users in the database", function(done) {
      request.get("/api/users/")
        .set("x-access-token", userToken)
        .expect(200)
        .end(function(err, res) {
          console.log(res.body);
          // expect((res.body)[0]).toEqual(jasmine.objectContaining({
          //   userName: "Bolu",
          //   email: "bolu@gmail.com"
          // }));
          // expect((res.body)[1]).toEqual(jasmine.objectContaining({
          //   userName: "Emmy",
          //   email: "emma@gmail.com"
          // }));
          expect(res.body.success).to.eql(true);
          expect(res.body.length).to.not.be(0);
          done();
        });
    });

    it("should not return a user when invalid id is specified", function(done) {
      var id = "56617723d2e4a33738e80e4b";
      request.get("/api/users/" + id)
        .set("x-access-token", userToken)
        .expect(200)
        .end(function(err, res) {
          console.log(res.body);
          expect(res.body.success).to.eql(false);
          expect(res.body.message).to.eql("User not found!");
          done();
        });
    });

    it("should not return a user unless authenticated", function(done) {
      request.get("/api/users/" + userId)
        .expect(403)
        .end(function(err, res) {
          expect(res.body.success).to.eql(false);
          expect(res.body.message).to.eql("No token provided");
          done();
        });
    });

  });

  describe("Update Users", function() {

    beforeEach(function(done) {
      role.create(_roleSeeders[2]).then(function(Role) {
        _userSeeders[2].role = Role._id;
        user.create(_userSeeders[2]).then(function(users) {
          userToken = jwt.sign(users, config.secret, {
            expiresInMinutes: 1440
          });
          userId = users._id;
          done();
        }, function(err) {
          console.log(err);
          done();
        });
      }, function(err) {
        console.log(err);
        done();
      });
    });

    afterEach(function(done) {
      user.remove({}).exec(function(err) {
        role.remove({}).exec(function(err) {
          if (err) {
            console.log(err);
          }
          console.log("Removed");
          done();
        });
      });
    });

    it("update only authenticated users", function(done) {
      request.put("/api/users/" + userId)
        .send({
          userName: "Lawry",
          name: {
            firstName: "Olaiya",
            lastName: "Bolutife",
          },
          email: "Lawry@gmail.com",
          password: "mine",
          role: "Manager"
        }).expect(200).end(function(err, res) {
          console.log(res.body);
          expect(res.body.success).to.eql(false);
          expect(res.body.message).to.equal("No token provided");

          done();
        });
    });

    it("update user with valid id", function(done) {
      request.put("/api/users/" + userId)
        .set("x-access-token", userToken)
        .send({
          userName: "Lawry",
          name: {
            firstName: "Olaiya",
            lastName: "Bolutife",
          },
          email: "Lawry@gmail.com",
          password: "mine",
          role: "Supervisor"
        }).expect(200).end(function(err, res) {
          console.log(res.body);
          expect(res.body.success).to.eql(true);
          expect(res.body.message).to.eql("User Successfully updated!");

          done();
        });
    });

    it("update only user with valid role", function(done) {
      request.put("/api/users/" + userId)
        .set("x-access-token", userToken)
        .send({
          userName: "Lawry",
          name: {
            firstName: "Olaiya",
            lastName: "Bolutife",
          },
          email: "Lawry@gmail.com",
          password: "mine",
          role: "Manager"
        }).expect(200).end(function(err, res) {
          console.log(res.body);
          expect(res.body.success).to.eql(false);
          expect(res.body.message).to.eql("Role does not exist, create first");

          done();
        });
    });

    it("update only user without a role", function(done) {
      request.put("/api/users/" + userId)
        .set("x-access-token", userToken)
        .send({
          userName: "Lawry",
          name: {
            firstName: "Olaiya",
            lastName: "Bolutife",
          },
          email: "Lawry@gmail.com",
          password: "mine",
          role: "Manager"
        }).expect(200).end(function(err, res) {
          console.log(res.body);
          expect(res.body.success).to.eql(false);
          expect(res.body.message).to.eql("Role does not exist, create first");

          done();
        });
    });

    it("does not update user with invalid id", function(done) {
      var id = "56617723d2e4a33738e80e4b";
      request.put("/api/users/" + id)
        .set("x-access-token", userToken)
        .send({
          userName: "Lawry",
          name: {
            firstName: "Olaiya",
            lastName: "Bolutife",
          },
          email: "Lawry@gmail.com",
          password: "mine",
          role: "Supervisor"
        }).expect(200).end(function(err, res) {
          console.log(res.body);
          expect(res.body.success).to.eql(false);
          expect(res.body.message).to.eql("User does not exist");

          done();
        });
    });
  });

  describe("Delete users", function() {

    beforeEach(function(done) {
      role.create(_roleSeeders[2]).then(function(Role) {
        _userSeeders[2].role = Role._id;
        user.create(_userSeeders[2]).then(function(users) {
          userToken = jwt.sign(users, config.secret, {
            expiresInMinutes: 1440
          });
          userId = users._id;
          done();
        }, function(err) {
          console.log(err);
          done();
        });
      }, function(err) {
        console.log(err);
        done();
      });
    });

    afterEach(function(done) {
      user.remove({}).exec(function(err) {
        role.remove({}).exec(function(err) {
          if (err) {
            console.log(err);
          }
          console.log("Removed");
          done();
        });
      });
    });

    it("delete authenticated users", function(done) {
      request.delete("/api/users/" + userId)
        .expect(403)
        .end(function(err, res) {
          console.log(res.body);
          expect(res.body.success).to.eql(false);
          expect(res.body.message).to.eql("No token provided");

          done();
        });
    });

    it("does not delete users with invalid id", function(done) {
      var id = "56617723d2e4a33738e80e4b";
      request.delete("/api/users/" + id)
        .set("x-access-token", userToken)
        .expect(403)
        .end(function(err, res) {
          console.log(res.body);
          expect(res.body.success).to.eql(false);
          expect(res.body.message).to.eql("User does not exist!");

          done();
        });
    });

    it("deletes valid users", function(done) {
      request.delete("/api/users/" + userId)
        .set("x-access-token", userToken)
        .expect(403)
        .end(function(err, res) {
          console.log(res.body);
          expect(res.body.success).to.eql(true);
          expect(res.body.message).to.eql("User successfully deleted!");

          done();
        });
    });

  });

});
