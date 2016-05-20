var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var program = require('commander');

var getImageList = require('./lib/imagelist');

program
  .usage('[options] <dir ...>')
  .option('-r, --recursive', 'walk through directory/ies recursively')
  .option('-i, --ignore [pattern]', 'file path pattern to ignore (regex)')
  .parse(process.argv);

if (!program.args.length) {
  program.help();
}

var dirList = program.args;
dirList = dirList.map(function (dir) {
  return path.resolve(dir);
});

function serve(request, response) {
  var urlPath = url.parse(request.url).pathname;
  var filename = decodeURIComponent(urlPath);
  var contentType;

  if (filename === '/') {
    var data = getImageList(dirList, {
      recursive: program.recursive,
      ignore: program.ignore
    });
    data = JSON.stringify(data, null, ' ');

    var template = fs.readFileSync(__dirname + '/templates/index.html', 'utf8');

    var content = template.replace('${data}', data);

    response.writeHead(200, {
      'Content-Type': 'text/html'
    });
    response.write(content);
    response.end();

  } else {

    fs.exists(filename, function(exists) {
      if (!exists) {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.write('404 Not Found\n' + filename);
        response.end();
        return;
      }

      fs.readFile(filename, 'binary', function(err, file) {
        if (err) {
          response.writeHead(500, {'Content-Type': 'text/plain'});
          response.end(err + '\n');
          return;
        }

        var contentType;
        if (/\.html$/.test(filename)) {
          contentType = 'text/html';
        }
        else if (/\.css$/.test(filename)) {
          contentType = 'text/css';
        }
        else if (/\.js$/.test(filename)) {
          contentType = 'text/javascript';
        }
        else if (/\.png$/.test(filename)) {
          contentType = 'image/png';
        }
        else if (/\.jpg$/.test(filename)) {
          contentType = 'image/jpeg';
        }
        else if (/\.pdf$/.test(filename)) {
          contentType = 'application/pdf';
        }
        else if (/\.svg$/.test(filename)) {
          contentType = 'image/svg+xml';
        }
        else {
          contentType = 'text/plain';
        }

        response.writeHead(200, {
          'Content-Type': contentType
        });
        response.write(file, 'binary');
        response.end();
      });
    });
  }
}

http.createServer(serve).listen(9876);
console.log('Server running at port 9876.');
