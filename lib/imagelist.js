var fs = require('fs');
var path = require('path');

var imageSuffixRegex = /\.(png|jpe?g|gif)$/i;

module.exports = function (dirList, options) {
  options = options || {};
  var files = [];

  var ignoreRegex;
  if (options.ignore) {
    ignoreRegex = new RegExp(options.ignore);
  }

  dirList.forEach(function listFiles (dir) {
    var dirFiles = fs.readdirSync(dir);

    dirFiles.forEach(function (file) {
      var filePath = path.join(dir, file);

      // skip if path matches ignore pattern
      if (ignoreRegex && ignoreRegex.test(filePath)) {
        return;
      }

      var isDir = fs.statSync(filePath).isDirectory();

      if (isDir) {
        if (options.recursive) {
          listFiles(filePath);
        }

        return;
      }

      if (imageSuffixRegex.test(file)) {
        files.push(filePath);
      }
    });
  });

  return files;
};
