//var apiServer = require('../server.js');
/*var http = require('http');
var fs = require('fs');*/
var should = require('should');
var assert = require('assert');
var request = require('supertest');  

describe('api validates format', function() {
  var url = 'http://localhost:9000';
  before(function(done) {
    done();
  });
  describe('content', function() {
    it('should return an 404 for /invalid/pussinboots/book', function(done){
      request(url)
        .get('/api/console/invalid/pussinboots/book')
        .expect('Content-Type', /text\/plain/)
  			.expect(400, 'Error occurred: Error: invalid format: valid fomarts are pdf, epub, mobi or html.') //Status code
  			.end(function(err,res) {
  					if (err) throw err;
  					done();
  				});
       });
    it('should return an 200 for /html/pussinboots/book', function(done){
      request(url)
        .get('/api/console/html/pussinboots/book')
        .expect('Content-Type', /text\/plain/)
        .expect(200) //Status code
        .end(function(err,res) {
            if (err) throw err;
            res.text.should.startWith('Building HTML...');
            done();
          });
       });
  });
});
