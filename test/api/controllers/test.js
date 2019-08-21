const should = require('should');
const request = require('supertest');
const app = require('../../../app');
const url = 'mongodb://localhost:27017';
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

let db;

const sampleUser = {
  user: {
    "id": 1,
    "userName": "sampleUser",
    "email": "su112@gmail.com",
    "password": "secret"
  }
};

const sampleMovie = {
  "id": 1,
  "title": "Matrix"
};

describe('netflix test', function () {
  before((done) => {
    MongoClient.connect(url, async (err, client) => {
      db = await client.db('netflixTest');
      if (err) return console.log(err);
      await db.createCollection('testUsers').then(() => {
        db.collection('testUsers').deleteMany({}).then(() => {
          db.collection('testUsers').insertOne(
            { sampleUser }
          );
        });
      });
      await db.createCollection('testSessions').then(() => {
        db.collection('testSessions').deleteMany({}).then(() => {
          db.collection('testSessions').insertOne(
            { "sessionId": "1", "userId": 1 }
          );
        });
      });
      await db.createCollection('testSessions').then(() => {
        db.collection('testMovies').deleteMany({}).then(() => {
          db.collection('testMovies').insertOne(
            { "id": sampleMovie.id, "title": sampleMovie.title }
          );
        });
      });
    }).then(() => {
      done();
    });
  });

  describe('POST /signup', function () {
    it('should return a user object', function (done) {
      request(app)
        .post('/signup')
        .set('Accept', 'application/json')
        .send({ sampleUser.user })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {
          should.not.exist(err);
          assert.equal(res.body.user, sampleUser.user);
          res.body.should.eql({ "user": sampleUser.user });
          done();
        });
    });

    it('should accept a user object as parameter in body', function (done) {
      request(app)
        .post('/signup')
        .body({ sampleUser.user })
        .send({ sampleUser.user })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {
          should.not.exist(err);
          res.body.should.eql({ "user": sampleUser.user });
          done();
        });
    });

    it('should response 400 when user already exists', function (done) {
    });

  });

  describe('POST /login', function () {
    it('should return a sessionID as a string', function (done) {
      request(app)
        .post('/login')
        .send({
          "userName": "sampleUser",
          "password": "secret"
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async function (err, res) {
          let session = await db.collection('testSessions').findOne({ "userID": 1 });
          should.not.exist(err);
          assert.equal(res.body.sessionId, session.sessionId);
          done();
        });
    });

    it('should accept a users credentials as parameter', function (done) {
      request(app)
        .post('/login')
        .send({
          "userName": "sampleUser",
          "password": "secret"
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          should.not.exist(err);
          assert.equal(res.body.userName, sampleUser.user.userName);
          assert.equal(res.body.password, sampleUser.user.password);
          done();
        });
    });

    it('should response 400 when users username not found', function (done) {
    });

    it('should response 400 when users password not correct', function (done) {
    });

    it('should response 400 when users sessionId cant saved', function (done) {
    });
  });

  describe('GET /videos', function () {
    it('should return an array of movie objects', function (done) {

    });

    it('should accept a video ID and a sessionID as parameter', function (done) {

    });

    it('should response 403 when user is unauthorized', function (done) {

    });

    it('should response 400 when movie title cant find', function (done) {

    });


  });

  describe('POST /videos/{id}/download', function () {
    it('should return movie object', function (done) {

    });

    it('should accept a video ID and a sessionID as parameter', function (done) {

    });

    it('should response 403 when user is unauthorized', function (done) {

    });

    it('should response 400 when movie title cant find', function (done) {

    });

    it('should response 400 when movie already in the users queue', function (done) {

    });
  });

  describe('GET /videos/queue', function () {
    it('should return the current users array of videoIDs', function (done) {

    });

    it('should accept a sessionID as parameter', function (done) {

    });

    it('should response 400 when users queue cant find', function (done) {

    });

    it('should response 403 when user is unauthorized', function (done) {

    });
  });

  describe('GET /logout', function () {
    it('should accept a sessionID as parameter', function (done) {

    });

    it('should response 403 when user is unauthorized', function (done) {

    });
  });

  after(async (done) => {
    await db.collection("testUsers").drop();
    await db.collection("testSessions").drop();
    await db.collection("testMovies").drop()
      .then(() => {
        done();
      });
  });
});