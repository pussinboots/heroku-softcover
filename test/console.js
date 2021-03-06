var apiServer = require('../server.js');
var should = require('should');
var assert = require('assert');
var request = require('supertest');  
var winston = require('winston');

describe('api', function() {
  var url = 'http://localhost:9000';
  
  before(function(done) {
  	done();
  });
  describe('console', function() {
	    it('should return 200 for /html/pussinboots/book', function(done){
			request(url)
				.get('/api/console/html/pussinboots/book')
				.expect('Content-Type', /text\/plain/)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) {
						throw err;
					}
					res.text.should.startWith('Building HTML...');
					done();
				});
		});
	    it('should return 200 for /pdf/pussinboots/book', function(done){
			request(url)
				.get('/api/console/pdf/pussinboots/book')
				.expect('Content-Type', /text\/plain/)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) {
						throw err;
					}
					res.text.should.startWith('Building PDF...');
					done();
				});
	    });
	    it('should return 200 for /epub/pussinboots/book', function(done){
			request(url)
				.get('/api/console/epub/pussinboots/book')
				.expect('Content-Type', /text\/plain/)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) {
						throw err;
					}
					res.text.should.startWith('Building EPUB...');
					done();
				});
	    });
	    it('should return 200 for /mobi/pussinboots/book', function(done){
			request(url)
				.get('/api/console/mobi/pussinboots/book')
				.expect('Content-Type', /text\/plain/)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) {
						throw err;
					}
					res.text.should.startWith('Building MOBI...');
					done();
				});
		});
	});
});