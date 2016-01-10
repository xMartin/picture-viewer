var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

var getImageList = require('./lib/imagelist');

var dirList = process.argv.slice(2);

function serve(request, response) {
  var urlPath = url.parse(request.url).pathname;
  var filename = decodeURIComponent(urlPath);
  var contentType;

  if (filename === '/') {
    var data = getImageList(dirList);
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
