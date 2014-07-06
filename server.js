var connect = require('connect');
var requestCl = require("request");
var serveStatic = require('serve-static');
var git  = require('gift');

var fs = require('fs');
var url = require('url');
//var sys = require('sys')
//var exec = require('child_process').exec;
var execSync = require('exec-sync');

var port = Number(process.env.PORT || 9000);
var server = connect()

function puts(error, stdout, stderr) { sys.puts(stdout) }

server.use(function (req, res, next) {
	if (req.url === '/favicon.ico') {
		next();
	} else {
		var repo = url.parse(req.url, true).query.repo;
		var result = execSync("rm -rfv /tmp/" + repo)
		console.log(result.stdout);
		console.log('try to clone git@github.com:' + repo);
		git.clone("https://github.com/" + repo, "/tmp/"+repo, function(err, _repo) {
	  		console.log('repo ' + _repo);
	  		console.log('err ' + err);
	  		var proc = execSync('cd /tmp/' + repo +' && softcover build:pdf',{cwd: '/tmp/'+repo}); 
	  			/*sys.puts(stdout);
	  			var fileStream = fs.createReadStream('/tmp/'+repo +'/ebooks/example.pdf');
				res.writeHead(200, {'Content-Type': 'application/pdf', "Cache-Control:" : "no-cache, no-store, must-revalidate" });
        		fileStream.pipe(res);*/

		    res.write(proc.stdout)
	        res.end();
	  	})	
	}
});

server.listen(port);
