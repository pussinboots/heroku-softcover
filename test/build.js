var apiServer = require('../server.js');
var http = require('http');
var should = require('should');
var assert = require('assert');
var request = require('supertest');  
var winston = require('winston');

describe('api', function() {
  var url = 'http://localhost:9000';
  // within before() you can run all the operations that are needed to setup your tests. In this case
  // I want to create a connection with the database, and when I'm done, I call done().
  before(function(done) {
  	/*instance = http.createServer(function(request, response) {
        apiServer.serve(request, response);
    }).listen(9000);
    instance.on("listening", function() {
        done();
    });*/
  	done();
  });
  // use describe to give a title to your test suite, in this case the tile is "Account"
  // and then specify a function in which we are going to declare all the tests
  // we want to run. Each test starts with the function it() and as a first argument 
  // we have to provide a meaningful title for it, whereas as the second argument we
  // specify a function that takes a single parameter, "done", that we will use 
  // to specify when our test is completed, and that's what makes easy
  // to perform async test!
  describe('discover', function() {
	    it('should return the json discover response', function(done) {   
		    request(url)
				.get('/api/discover')
				.expect('Content-Type', /json/)
				.expect(200, {"HEAD":[],"GET":["discover/:version","proto/*path","/console/pdf/:owner/:repo","/console/epub/:owner/:repo","/console/mobi/:owner/:repo","/console/html/:owner/:repo","/content/pdf/:owner/:repo","/content/epub/:owner/:repo","/content/mobi/:owner/:repo","/content/html/:owner/:repo","/build/pdf/:owner/:repo","/build/epub/:owner/:repo","/build/mobi/:owner/:repo","/build/html/:owner/:repo"],"POST":[],"PUT":[],"DELETE":[]}) //Status code
				.end(function(err, res) {
		          	if (err) {
		            	throw err;
		          	}
			  		done();
		    	});
	    });
  });
  describe('build', function() {
	    it('should return 200 for /html/pussinboots/book', function(done){
			request(url)
				.get('/api/build/html/pussinboots/book')
				.expect('Content-Type', /text\/html/)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) {
						throw err;
					}
					done();
				});
		});
	    it('should return 200 for /pdf/pussinboots/book', function(done){
			request(url)
				.get('/api/build/pdf/pussinboots/book')
				.expect('Content-Type', /application\/pdf/)
				.expect('Content-Disposition', 'attachment; filename="book.pdf"')
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) {
						throw err;
					}
					done();
				});
	    });
	    it('should return 200 for /epub/pussinboots/book', function(done){
			request(url)
				.get('/api/build/epub/pussinboots/book')
				.expect('Content-Type', /application\/epub/)
				.expect('Content-Disposition', 'attachment; filename="book.epub"')
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) {
						throw err;
					}
					done();
				});
	    });
	    it('should return 200 for /mobi/pussinboots/book', function(done){
			request(url)
				.get('/api/build/mobi/pussinboots/book')
				.expect('Content-Type', /application\/mobi/)
				.expect('Content-Disposition', 'attachment; filename="book.mobi"')
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) {
						throw err;
					}
					done();
				});
		});
	});
});