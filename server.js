var connect = require('connect');
var rest = require('connect-rest');
var bodyParser = require('body-parser');
var requestCl = require("request");
var serveStatic = require('serve-static');
var git  = require('gift');
var send  = require('send');

var fs = require('fs');
var url = require('url');
var sys = require('sys')
var exec = require('child_process').exec;
//var execSync = require('exec-sync');

var port = Number(process.env.PORT || 9000);
var server = connect()
    .use( bodyParser.urlencoded( { extended: true } ) )
    .use( bodyParser.json() );

var options = {
    context: '/api',
    logger:{ file: 'mochaTest.log', level: 'warn' },
    discoverPath: 'discover',
    protoPath: 'proto'
};

server.use( rest.rester( options ) );

function puts(error, stdout, stderr) { sys.puts(stdout) }

//make output file configurable per equest or setup config file in github
function softcover(repo, output, callback) {
	return exec("softcover build:" + output,{cwd: '/tmp/'+repo}, function (error, stdout, stderr) { 
		sys.puts(stdout);
		fs.readFile('/tmp/'+repo +'/ebooks/example.' + output, function (err, data) {
		  if (err) throw err;
		  callback(null, data, { headers: { 'Content-Disposition': 'attachment; filename="book.' + output + '"'  } });
		});
	});
}

function softcoverConsole(repo, output, callback) {
	return exec("softcover build:" + output,{cwd: '/tmp/'+repo}, function (error, stdout, stderr) { 
		sys.puts(stdout);
		callback(null, stdout);
	});
}

function softcoverHtml(repo, callback) {
	return exec("softcover build:pdf",{cwd: '/tmp/'+repo}, function (error, stdout, stderr) { 
		sys.puts(stdout);
		fs.readFile('/tmp/'+repo +'/html/example.html', function (err, data) {
		  if (err) throw err;
		  callback(null, data);
		});
	});
}

function fetchRepo(repo, output, stdout, callback) {
	console.log("checkl if exists /tmp/" +repo);
	if (fs.existsSync("/tmp/" +repo)) {
		console.log('try to sync git@github.com:' + repo);
		var repository = git("/tmp/"+repo);
    	repository.pull('master', function(err, _repo) {
	  		console.log('synced repo ' + _repo);
	  		console.log('err ' + err);
	  		if(stdout) 
	  			softcoverConsole(repo, output, callback);
	  		else
		  		if(output != 'html')
		  			softcover(repo, output, callback);
		  		else 
		  			softcoverHtml(repo, callback);
	  	})
	} else {
		console.log('try to clone git@github.com:' + repo);
		git.clone("https://github.com/" + repo, "/tmp/"+repo, function(err, _repo) {
	  		console.log('repo ' + _repo);
	  		console.log('err ' + err);
	  		if(stdout) 
	  			softcoverConsole(repo, output, callback);
	  		else
		  		if(output != 'html')
		  			softcover(repo, output, callback);
		  		else 
		  			softcoverHtml(repo, callback);
	  	})
  	}	
}

rest.get('/console/pdf/:owner/:repo', function (request, content, callback) {
	console.log( 'Received:' + request.format() + ' ' + JSON.stringify(content) );
	var repo = request.parameters.owner +"/" + request.parameters.repo
	fetchRepo(repo, 'pdf', true, callback)
}, { contentType:'text/plain' } );

rest.get('/console/epub/:owner/:repo', function (request, content, callback) {
	console.log( 'Received:' + request.format() + ' ' + JSON.stringify(content) );
	var repo = request.parameters.owner +"/" + request.parameters.repo
	fetchRepo(repo, 'epub', true, callback)	
}, { contentType:'text/plain'} );

rest.get('/console/mobi/:owner/:repo', function (request, content, callback) {
	console.log( 'Received:' + request.format() + ' ' + JSON.stringify(content) );
	var repo = request.parameters.owner +"/" + request.parameters.repo
	fetchRepo(repo, 'mobi', true, callback)	
}, { contentType:'text/plain' } );

rest.get('/pdf/:owner/:repo', function (request, content, callback) {
	console.log( 'Received:' + request.format() + ' ' + JSON.stringify(content) );
	var repo = request.parameters.owner +"/" + request.parameters.repo
	fs.readFile('/tmp/'+repo +'/ebooks/example.pdf', function (err, data) {
		if (err) {
			var error = new Error(err);
	    	error.statusCode = 404;
	    	return callback( error );
	    }
		callback(null, data, { headers: { 'Content-Disposition': 'attachment; filename="book.pdf'  } });
	});
}, { contentType:'application/pdf' } );

rest.get('/epub/:owner/:repo', function (request, content, callback) {
	console.log( 'Received:' + request.format() + ' ' + JSON.stringify(content) );
	var repo = request.parameters.owner +"/" + request.parameters.repo
	fs.readFile('/tmp/'+repo +'/ebooks/example.epub', function (err, data) {
		if (err) {
			var error = new Error(err);
	    	error.statusCode = 404;
	    	return callback( error );
	    }
		callback(null, data, { headers: { 'Content-Disposition': 'attachment; filename="book.epub'  } });
	});	
}, { contentType:'application/epub'} );

rest.get('/mobi/:owner/:repo', function (request, content, callback) {
	console.log( 'Received:' + request.format() + ' ' + JSON.stringify(content) );
	var repo = request.parameters.owner +"/" + request.parameters.repo
	fs.readFile('/tmp/'+repo +'/ebooks/example.mobi', function (err, data) {
		if (err) {
			var error = new Error(err);
	    	error.statusCode = 404;
	    	return callback( error );
	    }
		callback(null, data, { headers: { 'Content-Disposition': 'attachment; filename="book.mobi"'  } });
	});	
}, { contentType:'application/mobi' } );

rest.get('/html/:owner/:repo', function (request, content, callback) {
	console.log( 'Received:' + request.format() + ' ' + JSON.stringify(content) );
	var repo = request.parameters.owner +"/" + request.parameters.repo
	fs.readFile('/tmp/'+repo +'/html/example.html', function (err, data) {
		if (err) {
			var error = new Error(err);
	    	error.statusCode = 404;
	    	return callback( error );
	    }
		callback(null, data);
	});
}, { contentType:'text/html' } );

rest.get('/build/pdf/:owner/:repo', function (request, content, callback) {
	console.log( 'Received:' + request.format() + ' ' + JSON.stringify(content) );
	var repo = request.parameters.owner +"/" + request.parameters.repo
	fetchRepo(repo, 'pdf', false, callback)
}, { contentType:'application/pdf' } );

rest.get('/build/epub/:owner/:repo', function (request, content, callback) {
	console.log( 'Received:' + request.format() + ' ' + JSON.stringify(content) );
	var repo = request.parameters.owner +"/" + request.parameters.repo
	fetchRepo(repo, 'epub', false, callback)	
}, { contentType:'application/epub'} );

rest.get('/build/mobi/:owner/:repo', function (request, content, callback) {
	console.log( 'Received:' + request.format() + ' ' + JSON.stringify(content) );
	var repo = request.parameters.owner +"/" + request.parameters.repo
	fetchRepo(repo, 'mobi', false, callback)	
}, { contentType:'application/mobi' } );

rest.get('/build/html/:owner/:repo', function (request, content, callback) {
	console.log( 'Received:' + request.format() + ' ' + JSON.stringify(content) );
	var repo = request.parameters.owner +"/" + request.parameters.repo
	fetchRepo(repo, 'html', false, callback)
}, { contentType:'text/html' } );

server.use(function static(req, res, next) {
	//todo url validation match start url dont't care what follows after some slashes
	if (req.url.match(/^\/api\/html\/(.+)\/(.+)\/(.+)\/(.+)/)) {
		var parts = url.parse(req.url, true).pathname.split('/');
		var file = '/tmp/' + parts[3] + "/" + parts[4] + '/html/' + parts.splice(5, parts.length).join('/')
		console.log(file);
		var stream = send(req, file, {});
		stream.pipe(res);
	} else {
		next();
	}
});
server.listen(port);