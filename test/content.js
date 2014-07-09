//var apiServer = require('../server.js');
//var http = require('http');
var fs = require('fs');
var should = require('should');
var assert = require('assert');
var request = require('supertest');  
var winston = require('winston');

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
 
describe('api', function() {
  var url = 'http://localhost:9000';
  before(function(done) {
    deleteFolderRecursive('/tmp/repos/pussinboots/book/ebooks')
    fs.unlinkSync('/tmp/repos/pussinboots/book/html/example.html')
  	done();
  });
  describe('content', function() {
 	    it('should return an 404 for /html/pussinboots/book', function(done){
  			request(url)
  				.get('/api/content/html/pussinboots/book')
          .expect('Content-Type', /text\/plain/)
  				.expect(500, 'Error occurred: Error: ENOENT, open \'/tmp/repos/pussinboots/book/html/example.html\'') //Status code
  				.end(function(err,res) {
  					if (err) throw err;
  					done();
  				});
	    });
      it('should return an 404 for /pdf/pussinboots/book', function(done){
        request(url)
          .get('/api/content/pdf/pussinboots/book')
          .expect('Content-Type', /text\/plain/)
          .expect(500, 'Error occurred: Error: ENOENT, open \'/tmp/repos/pussinboots/book/ebooks/example.pdf\'') //Status code
          .end(function(err,res) {
            if (err) throw err;
            done();
          });
      });
      it('should return an 404 for /epub/pussinboots/book', function(done){
        request(url)
          .get('/api/content/epub/pussinboots/book')
          .expect('Content-Type', /text\/plain/)
          .expect(500, 'Error occurred: Error: ENOENT, open \'/tmp/repos/pussinboots/book/ebooks/example.epub\'') //Status code
          .end(function(err,res) {
            if (err) throw err;
            done();
          });
      });
      it('should return an 404 for /mobi/pussinboots/book', function(done){
        request(url)
          .get('/api/content/mobi/pussinboots/book')
          .expect('Content-Type', /text\/plain/)
          .expect(500, 'Error occurred: Error: ENOENT, open \'/tmp/repos/pussinboots/book/ebooks/example.mobi\'') //Status code
          .end(function(err,res) {
            if (err) throw err;
            done();
          });
      });

	});
});
