/****************************************************************
 *Name: DMS API Test.
 *Description: To test the document's segment of the DMS API
 *Author: Babalola Maryam
 *****************************************************************/

(function() {
  'Use strict';

  var jwt = require('jsonwebtoken'),
    expect = require('expect.js'),
    server = require('./../server.js'),
    request = require('supertest')(server),
    User = require('./../app/models/user.models'),
    role = require('./../app/models/role.models'),
    Docs = require('./../app/models/document.models'),
    config = require('./../config/config'),
    _userSeeders = require('./../seeders/user.seeders.json'),
    _roleSeeders = require('./../seeders/role.seeders.json'),
    _docSeeders = require('./../seeders/document.seeders.json');

  describe('Documents', function() {
    describe('Creating document(s)', function() {
      var userToken;
      beforeEach(function(done) {
        //creating a role using the content of the role seeder
        role.create(_roleSeeders[1]).then(function(Role) {
          //creating a user using the content of the user seeder
          _userSeeders[1].role = Role._id;
          User.create(_userSeeders[1]).then(function(users) {
            //generating a token for the user created
            userToken = jwt.sign(users, config.secret, {
              expiresInMinutes: 1440
            });
            _docSeeders[1].role = Role._id;
            _docSeeders[1].ownerId = users._id;
            //creating a document using the content of the document seeder
            Docs.create(_docSeeders[1]).then(function() {}, function(err) {
              if (err) {
                console.log(err);
                done();
              }
            });
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
        //deleting the document created
        Docs.remove({}).exec(function() {
          //deleting the user created
          User.remove({}).exec(function() {
            //deleting the role created
            role.remove({}).exec(function(err) {
              if (err) {
                console.log(err);
              }
              done();
            });
          });
        });
      });

      it('creates unique documents', function(done) {
        _docSeeders[1].role = 'Manager';
        _docSeeders[1].ownerId = 'Emmy';
        request.post('/api/documents')
          .set('x-access-token', userToken)
          .send(_docSeeders[1])
          .expect(409)
          .end(function(err, res) {
            expect(res.status).to.be(409);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Document already exists!');
            done();
          });
      });

      it('should not create document for unauthenticated user', function(done) {
        request.post('/api/documents/')
          .send(_docSeeders[0])
          .expect(403)
          .end(function(err, res) {
            expect(res.status).to.be(403);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('No token provided');
            done();
          });
      });

      it('should not create doc without role', function(done) {
        request.post('/api/documents')
          .set('x-access-token', userToken)
          .send({
            title: _docSeeders[1].title,
            content: _docSeeders[1].content,
            role: ''
          })
          .expect(400)
          .end(function(err, res) {
            expect(res.status).to.be(400);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Role not found. Create first!');
          });
        done();
      });

      it('should create a new document', function(done) {
        _docSeeders[2].role = 'Manager';
        _docSeeders[2].ownerId = 'Emmy';
        request.post('/api/documents')
          .set('x-access-token', userToken)
          .send(_docSeeders[2])
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('Document successfully created');
            done();
          });
      });
    });

    describe('Performing CRUD operations', function() {
      var userToken,
        doc_role,
        doc_user,
        doc_id,
        title,
        limit = 1;
      beforeEach(function(done) {
        //creating a role using the content of the role seeder
        role.create(_roleSeeders[2]).then(function(Role) {
          //creating a user using the content of the user seeder
          _userSeeders[2].role = Role._id;
          User.create(_userSeeders[2]).then(function(users) {
            userToken = jwt.sign(users, config.secret, {
              expiresInMinutes: 1440
            });

            //assigning the role and ownerId of _docSeeders[2] to an Id
            _docSeeders[2].role = Role._id;
            _docSeeders[2].ownerId = users._id;

            //assigning the role and ownerId of _docSeeders[0] to an Id
            _docSeeders[0].ownerId = users._id;
            _docSeeders[0].role = Role._id;

            doc_role = Role._id;
            doc_user = users._id;
            //creating a document using the content of the document seeder
            Docs.create(_docSeeders[2]).then(function(doc) {
              doc_id = doc._id;
              title = doc.title;
              done();
            }, function(err) {
              if (err) {
                console.log(err);
                done();
              }
            });
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
        //deleting the document created
        Docs.remove({}).exec(function() {
          //deleting the user created
          User.remove({}).exec(function() {
            //deleting the role created
            role.remove({}).exec(function(err) {
              if (err) {
                console.log(err);
              }
              done();
            });
          });
        });
      });

      it('should return a limited document', function(done) {
        request.get('/api/documents?limit=' + limit)
          .set('x-access-token', userToken)
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.length).to.not.be(0);
            expect(res.body[0].title).to.be('third');
            done();
          });
      });

      it('return all documents', function(done) {
        var newdoc = new Docs(_docSeeders[0]);
        newdoc.save();

        request.get('/api/documents/')
          .set('x-access-token', userToken)
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.length).to.not.be(0);
            expect(res.body[0].title).to.be('third');
            expect(res.body[1].title).to.be('first');
            done();
          });
      });

      it('get documents by role', function(done) {
        request.get('/api/documents/role/' + doc_role + '/' + limit)
          .set('x-access-token', userToken)
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body[0].title).to.be('third');
            expect(res.body.length).to.not.be(0);
            done();
          });
      });

      it('get documents by user', function(done) {
        var newdoc = new Docs(_docSeeders[0]);
        newdoc.save();

        request.get('/api/user/' + doc_user + '/documents/')
          .set('x-access-token', userToken)
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.length).to.not.be(0);
            expect(res.body[0].title).to.be('third');
            expect(res.body[1].title).to.be('first');
            done();
          });
      });

      it('should verify user is valid', function(done) {
        var id = '568831c53ff90b4456491b50';
        request.get('/api/user/' + id + '/documents/')
          .set('x-access-token', userToken)
          .expect(404)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('User has no document');
            done();
          });
      });

      it('should return documents by id', function(done) {
        request.get('/api/documents/' + doc_id)
          .set('x-access-token', userToken)
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.length).to.not.be(0);
            expect(res.body.title).to.be('third');
            done();
          });
      });

      it('should verify documents Id is valid', function(done) {
        var id = '568831c53ff90b4456491b50';
        request.get('/api/documents/' + id)
          .set('x-access-token', userToken)
          .expect(400)
          .end(function(err, res) {
            expect(res.status).to.be(400);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Document not found');
            done();
          });
      });

      it('should update a document', function(done) {
        request.put('/api/documents/' + doc_id)
          .set('x-access-token', userToken)
          .send({
            title: 'New file',
            content: 'Updating a document',
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('Document Successfully updated!');

            done();
          });
      });

      it('only creator should edit documents', function(done) {
        var newuser = new User(_userSeeders[0]);
        newuser.save();
        var newUserToken = jwt.sign(newuser, config.secret, {
          expiresInMinutes: 1440
        });
        request.put('/api/documents/title/' + title + '/' + doc_id)
          .set('x-access-token', newUserToken)
          .send({
            title: 'New file',
            content: 'Updating a document',
          })
          .expect(403)
          .end(function(err, res) {
            expect(res.status).to.be(403);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Access denied');

            done();
          });
      });

      it('should not edit document without a valid id', function(done) {
        var id = '568831c53ff90b4456491b50';
        request.put('/api/documents/' + id)
          .set('x-access-token', userToken)
          .send({
            title: 'New file',
            content: 'Updating a document',
          })
          .expect(404)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Document does not exist');

            done();
          });
      });
    });



    describe('', function() {
      var userToken,
        doc_role,
        doc_user,
        doc_id,
        title;
      beforeEach(function(done) {
        //creating a role using the content of the role seeder
        role.create(_roleSeeders[2]).then(function(Role) {
          //creating a user using the content of the user seeder
          _userSeeders[2].role = Role._id;
          User.create(_userSeeders[2]).then(function(users) {
            userToken = jwt.sign(users, config.secret, {
              expiresInMinutes: 1440
            });

            //assigning the role and ownerId of _docSeeders[2] to an Id
            _docSeeders[2].role = Role._id;
            _docSeeders[2].ownerId = users._id;

            //assigning the role and ownerId of _docSeeders[0] to an Id
            _docSeeders[0].ownerId = users._id;
            _docSeeders[0].role = Role._id;

            doc_role = Role._id;
            doc_user = users._id;
            //creating a document using the content of the document seeder
            Docs.create(_docSeeders[2]).then(function(doc) {
              doc_id = doc._id;
              title = doc.title;
              done();
            }, function(err) {
              if (err) {
                console.log(err);
                done();
              }
            });
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
        //deleting the document created
        Docs.remove({}).exec(function() {
          //deleting the user created
          User.remove({}).exec(function() {
            //deleting the role created
            role.remove({}).exec(function(err) {
              if (err) {
                console.log(err);
              }
              done();
            });
          });
        });
      });
      it('should delete document by id', function(done) {
        request.delete('/api/documents/' + doc_id)
          .set('x-access-token', userToken)
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('Document successfully deleted');
            done();
          });
      });

      it('should not delete document with invalid id', function(done) {
        var id = '568831c53ff90b4456491b50';
        request.delete('/api/documents/' + id)
          .set('x-access-token', userToken)
          .expect(400)
          .end(function(err, res) {
            expect(res.status).to.eql(400);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Document not found');
            done();
          });
      });

      it('should not allow new user delete document of a user', function(done) {
        var newuser = new User(_userSeeders[0]);
        newuser.save();
        var newUserToken = jwt.sign(newuser, config.secret, {
          expiresInMinutes: 1440
        });
        request.delete('/api/documents/title/' + title + '/' + doc_id)
          .set('x-access-token', newUserToken)
          .expect(403)
          .end(function(err, res) {
            expect(res.status).to.eql(403);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Access denied');
            done();
          });
      });
      });
    });
})();
