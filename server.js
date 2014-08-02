var connect = require('connect');
var rest = require('connect-rest');
var bodyParser = require('body-parser');
var requestCl = require("request");
var serveStatic = require('serve-static');
var git  = require('gift');
var send  = require('send');
var yaml = require('yamljs');

var fs = require('fs');
var url = require('url');
var sys = require('sys');
var exec = require('child_process').exec;
var repoFolder = "/tmp/repos/";
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
	var options = output === "pdf" ? "-n" : ""
	return exec("softcover build:" + output + " " + options,{cwd: repoFolder +repo}, function (error, stdout, stderr) { 
		sys.puts(stdout);
		sys.puts(stderr);
		var data = readData(repo, output);
		var headers = getHeaders(output);
		callback(null, data, {headers:headers});
	});
}

function softcoverConsole(repo, output, callback) {
	var options = output === "pdf" ? "-n" : ""
	return exec("softcover build:" + output + " " + options,{cwd: repoFolder +repo}, function (error, stdout, stderr) { 
		sys.puts(stderr);
		sys.puts(stdout);
		callback(null, stderr + stdout);
	});
}

function buildBook(err, repo, output, stdout, callback) {
	console.log('err ' + err);
	if(stdout) 
		softcoverConsole(repo, output, callback);
	else
		softcover(repo, output, callback);
}

function fetchRepo(repo, output, stdout, callback) {
	console.log("checkl if exists "+ repoFolder +repo);
	if (fs.existsSync(repoFolder +repo)) {
		console.log('git pull ' + repoFolder+repo);
		var repository = git(repoFolder+repo);
    	repository.pull('master', function(err, _repo) {
	  		buildBook(err,repo, output, stdout, callback);
	  	})
	} else {
		console.log('git clone clone https://github.com/' + repo);
		git.clone("https://github.com/" + repo, repoFolder +repo, function(err, _repo) {
	  		buildBook(err,repo, output, stdout, callback);
	  	})
  	}	
}

var FORMATS = [ "pdf", "epub", "mobi", "html"];

function getHeaders(format) {
	if(format !== "html") 
		return {'Content-Disposition': 'attachment; filename="book.' + format + '"', 'Content-Type':'application/'+format  } 
	else
		return {'Content-Type':'text/'+format  } 
}

function readData(repo, format) {
	var bookYml = yaml.load(repoFolder+repo +'/config/book.yml');
	if(format !== "html") 
		return fs.createReadStream(repoFolder+repo +'/ebooks/'+ bookYml.filename + "." + format);
	else
		return fs.createReadStream(repoFolder+repo +'/html/'+ bookYml.filename + "." + format);
}

rest.get('/console/@format/:owner/:repo', function (request, content, callback) {
	console.log( 'Received:' + request.parameters.format + ' ' + JSON.stringify(content) );
	var repo = request.parameters.owner +"/" + request.parameters.repo
	fetchRepo(repo, request.parameters.format, true, callback)
}, { contentType:'text/plain', format:FORMATS } );

rest.get('/content/@format/:owner/:repo', function (request, content, callback) {
	console.log( 'Received:' + request.parameters.format + ' ' + JSON.stringify(content) );
	var repo = request.parameters.owner +"/" + request.parameters.repo;
	var data = readData(repo, request.parameters.format);
	var headers = getHeaders(request.parameters.format);
	callback(null, data, {headers:headers});
}, {format:FORMATS} );

rest.get('/build/@format/:owner/:repo', function (request, content, callback) {
	console.log( 'Received:' + request.parameters.format + ' ' + JSON.stringify(content) );
	var repo = request.parameters.owner +"/" + request.parameters.repo
	fetchRepo(repo, request.parameters.format, false, callback)
}, {format:FORMATS} );

server.use(function(req, res, next) {
	//todo url validation match start url dont't care what follows after some slashes
	console.log('server static')
	if (req.url.match(/^\/api\/.+\/html\/(.+)\/(.+)\/(.+)\/(.+)/)) {
		var parts = url.parse(req.url, true).pathname.split('/');
		var file = repoFolder + parts[4] + "/" + parts[5] + '/html/' + parts.splice(6, parts.length).join('/')
		console.log(file);
		var stream = send(req, file, {});
		stream.pipe(res);
	} else {
		next();
	}
});
server.listen(port);
