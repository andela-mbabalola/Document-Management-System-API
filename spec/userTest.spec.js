/****************************************************************
*Name: DMS API Test.
*Description: To test the user's segment of the DMS API
*Author: Babalola Maryam
*****************************************************************/

(function() {
  'Use strict';

  var jwt = require('jsonwebtoken'),
    fs = require('fs'),
    expect = require('expect.js'),
    server = require('./../server.js'),
    request = require('supertest')(server),
    User = require('./../app/models/user.models'),
    role = require('./../app/models/role.models'),
    config = require('./../config/config'),
    userSeeders = fs.readFileSync(__dirname + '/../seeders/user.seeders.json'),
    roleSeeders = fs.readFileSync(__dirname + '/../seeders/role.seeders.json'),

    _userSeeders = JSON.parse(userSeeders),
    _roleSeeders = JSON.parse(roleSeeders);

  describe('Users', function() {
    describe('/POST: Validate user login', function() {

      beforeEach(function(done) {
        //create a new role using content of the role seeder
        role.create(_roleSeeders[2]).then(function(Role) {
          //create a new user using content of the user seeder
          _userSeeders[2].role = Role._id;
          User.create(_userSeeders[2]).then(function() {
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
        //delete the user from the database
        User.remove({}).exec(function() {
          //delete role from the database
          role.remove({}).exec(function(err) {
            if (err) {
              console.log(err);
            }
            done();
          });
        });
      });

      it('should connect to root', function(done) {
        request.get('/')
          .expect(200);
        done();
      });

      it('verifies that user logs in with correct password', function(done) {
        request.post('/api/users/login')
          .send({
            userName: _userSeeders[2].userName,
            password: 'me'
          })
          .expect(404)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql
              ('Authentication failed. Wrong password');
            done();
          });
      });

      it('verifies that user logs in with correct userName', function(done) {
        request.post('/api/users/login')
          .send({
            userName: 'myName',
            password: _userSeeders[2].password
          })
          .expect(404)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql
              ('Authentication failed. User not found');

            done();
          });
      });

      it('should login new users', function(done) {
        request.post('/api/users/login')
          .send({
            userName: _userSeeders[2].userName,
            password: _userSeeders[2].password
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('Successfully logged in');
            expect(res.body.message).to.not.be.empty();

            done();
          });
      });
    });

    describe('/POST: Create new users', function() {
      beforeEach(function(done) {
        //create a new role using content of the role seeder
        role.create(_roleSeeders[1]).then(function(Role) {
          _userSeeders[1].role = Role._id;
          //create a new user using content of the user seeder
          User.create(_userSeeders[1]).then(function() {
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
        //delete user from the database
        User.remove({}).exec(function() {
          //delete roles from the database
          role.remove({}).exec(function(err) {
            if (err) {
              console.log(err);
              done();
            }
            console.log('Removed');
            done();
          });
        });
      });

      it('create a new user', function(done) {
        _userSeeders[0].role = 'Manager';

        request.post('/api/users')
          .send({
            firstName: _userSeeders[0].name.firstName,
            lastName: _userSeeders[0].name.lastName,
            userName: _userSeeders[0].userName,
            password: _userSeeders[0].password,
            email: _userSeeders[0].email,
            role: _userSeeders[0].role
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('User Successfully created!');

            done();
          });
      });

      it('Does not create a user without a valid role', function(done) {
        request.post('/api/users')
          .send({
            firstName: _userSeeders[1].name.firstName,
            lastName: _userSeeders[1].name.lastName,
            userName: _userSeeders[1].userName,
            password: _userSeeders[1].password,
            email: _userSeeders[1].email,
            role: 'Owner'
          })
          *.expect(404)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Role not found. Create first');

            done();
          });
      });

      it('Does not create a user without a role', function(done) {
        request.post('/api/users')
          .send({
            firstName: _userSeeders[1].name.firstName,
            lastName: _userSeeders[1].name.lastName,
            userName: _userSeeders[1].userName,
            password: _userSeeders[1].password,
            email: _userSeeders[1].email,
          })
          .expect(404)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Role not found. Create first');

            done();
          });
      });

      it('creates unique users', function(done) {
        _userSeeders[1].role = 'Manager';
        request.post('/api/users/')
          .send({
            firstName: _userSeeders[1].name.firstName,
            lastName: _userSeeders[1].name.lastName,
            userName: _userSeeders[1].userName,
            password: _userSeeders[1].password,
            email: _userSeeders[1].email,
            role: _userSeeders[1].role
          })
          .expect(409)
          .end(function(err, res) {
            expect(res.status).to.be(409);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('User already exists!');

            done();
          });
      });

      it('checks for before creating firstName and lastName', function(done) {
        _userSeeders[2].role = 'Manager';
        request.post('/api/users')
          .send({
            userName: _userSeeders[2].userName,
            password: _userSeeders[2].password,
            email: _userSeeders[2].email,
            role: _userSeeders[2].role
          })
          .expect(406)
          .end(function(err, res) {
            expect(res.status).to.be(406);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql
              ('Please enter your firstName and lastName');

            done();
          });
      });

    });


    describe('/GET: Get all users', function() {
      var userId,
        userToken;

      beforeEach(function(done) {
        //create a new role using content of the role seeder
        role.create(_roleSeeders[2]).then(function(Role) {
          _userSeeders[2].role = Role._id;
          //create a new user using content of the user seeder
          User.create(_userSeeders[2]).then(function(users) {
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
        //delete roles from the databse
        User.remove({}).exec(function() {
          //delete users from database
          role.remove({}).exec(function(err) {
            if (err) {
              console.log(err);
            }
            done();
          });
        });
      });

      it('should return a user when id is specified', function(done) {
        request.get('/api/users/' + userId)
          .set('x-access-token', userToken)
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.length).not.to.be(0);
            expect(res.body.userName).to.be('Bolu');
            expect(res.body.email).to.be('bolu@gmail.com');
            done();
          });
      });

      it('returns all the available users in the database', function(done) {
        request.get('/api/users/')
          .set('x-access-token', userToken)
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.length).to.not.be(0);
            expect(res.body[0].userName).to.be('Bolu');
            expect(res.body[0].email).to.be('bolu@gmail.com');
            done();
          });
      });

      it('return no user when invalid id is specified', function(done) {
        var id = '56617723d2e4a33738e80e4b';
        request.get('/api/users/' + id)
          .set('x-access-token', userToken)
          .expect(404)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('User not found!');
            done();
          });
      });

      it('should not return a user unless authenticated', function(done) {
        request.get('/api/users/' + userId)
          .expect(403)
          .end(function(err, res) {
            console.log(res.body);
            expect(res.status).to.be(403);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('No token provided');
            done();
          });
      });

    });

    describe('Update Users', function() {
      var userId,
        userToken;

      beforeEach(function(done) {
        //create a new role using content of the role seeder
        role.create(_roleSeeders[2]).then(function(Role) {
          _userSeeders[2].role = Role._id;
          //create a new user using content of the user seeder
          User.create(_userSeeders[2]).then(function(users) {
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
        //delete user from the database
        User.remove({}).exec(function() {
          //delete role from the database
          role.remove({}).exec(function(err) {
            if (err) {
              console.log(err);
            }
            done();
          });
        });
      });

      it('update only authenticated users', function(done) {
        request.put('/api/users/' + userId)
          .send({
            userName: 'Lawry',
            name: {
              firstName: 'Olaiya',
              lastName: 'Bolutife',
            },
            email: 'Lawry@gmail.com',
            password: 'mine',
            role: 'Manager'
          })
          .expect(403)
          .end(function(err, res) {
            console.log(res.body);
            expect(res.status).to.be(403);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.equal('No token provided');

            done();
          });
      });

      it('update user with valid id', function(done) {
        request.put('/api/users/' + userId)
          .set('x-access-token', userToken)
          .send({
            userName: 'Lawry',
            name: {
              firstName: 'Olaiya',
              lastName: 'Bolutife',
            },
            email: 'Lawry@gmail.com',
            password: 'mine',
            role: 'Supervisor'
          }).expect(200).end(function(err, res) {
            console.log(res.body);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('User Successfully updated!');

            done();
          });
      });

      it('update only user with valid role', function(done) {
        request.put('/api/users/' + userId)
          .set('x-access-token', userToken)
          .send({
            userName: 'Lawry',
            name: {
              firstName: 'Olaiya',
              lastName: 'Bolutife',
            },
            email: 'Lawry@gmail.com',
            password: 'mine',
            role: 'Manager'
          })
          .expect(404)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql
              ('Role does not exist, create first');

            done();
          });
      });

      it('update only user without a role', function(done) {
        request.put('/api/users/' + userId)
          .set('x-access-token', userToken)
          .send({
            userName: 'Lawry',
            name: {
              firstName: 'Olaiya',
              lastName: 'Bolutife',
            },
            email: 'Lawry@gmail.com',
            password: 'mine',
            role: 'Manager'
          })
          .expect(404)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql
              ('Role does not exist, create first');

            done();
          });
      });

      it('does not update user with invalid id', function(done) {
        var id = '56617723d2e4a33738e80e4b';
        request.put('/api/users/' + id)
          .set('x-access-token', userToken)
          .send({
            userName: 'Lawry',
            name: {
              firstName: 'Olaiya',
              lastName: 'Bolutife',
            },
            email: 'Lawry@gmail.com',
            password: 'mine',
            role: 'Supervisor'
          })
          .expect(404)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('User does not exist');

            done();
          });
      });
    });

    describe('Delete users', function() {
      var userId,
        userToken;

      beforeEach(function(done) {
        //create a new role using content of the role seeder
        role.create(_roleSeeders[2]).then(function(Role) {
          _userSeeders[2].role = Role._id;
          //create a new user using content of the user seeder
          User.create(_userSeeders[2]).then(function(users) {
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
        //delete user from the database
        User.remove({}).exec(function() {
          //delete role from the database
          role.remove({}).exec(function(err) {
            if (err) {
              console.log(err);
            }
            done();
          });
        });
      });

      it('delete authenticated users', function(done) {
        request.delete('/api/users/' + userId)
          .expect(403)
          .end(function(err, res) {
            expect(res.status).to.be(403);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('No token provided');

            done();
          });
      });

      it('does not delete users with invalid id', function(done) {
        var id = '56617723d2e4a33738e80e4b';
        request.delete('/api/users/' + id)
          .set('x-access-token', userToken)
          .expect(404)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('User does not exist!');

            done();
          });
      });

      it('deletes valid users', function(done) {
        request.delete('/api/users/' + userId)
          .set('x-access-token', userToken)
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('User successfully deleted!');

            done();
          });
      });

    });


  });

})();
