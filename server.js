var connect = require('connect');
var requestCl = require("request");
var serveStatic = require('serve-static');
var git  = require('gift');

var fs = require('fs');
var url = require('url');
var sys = require('sys')
var exec = require('child_process').exec;

var port = Number(process.env.PORT || 9000);
var server = connect()

function puts(error, stdout, stderr) { sys.puts(stdout) }

server.use(function (req, res, next) {
	if (req.url === '/favicon.ico') {
		next();
	} else {
		var repo = url.parse(req.url, true).query.repo;
		exec("rm -rfv " + repo,{cwd: '/tmp/'}, function (error, stdout, stderr) { 
		  			sys.puts(stdout);
		  		});
		
			console.log('try to clone git@github.com:' + repo);
			git.clone("https://github.com/" + repo, "/tmp/"+repo, function(err, _repo) {
		  		console.log('repo ' + _repo);
		  		console.log('err ' + err);
		  		exec("softcover build:pdf",{cwd: '/tmp/'+repo}, function (error, stdout, stderr) { 
		  			res.write(stdout);
		  			res.end();
		  			/*sys.puts(stdout);
		  			var fileStream = fs.createReadStream('/tmp/'+repo +'/ebooks/example.pdf');
					res.writeHead(200, {'Content-Type': 'application/pdf', "Cache-Control:" : "no-cache, no-store, must-revalidate" });
	        		fileStream.pipe(res);*/
		  		});
		  	})
		
	}
});

server.listen(port);
