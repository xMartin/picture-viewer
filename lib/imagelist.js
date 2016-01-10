var fs = require('fs');

var imageSuffixRegex = /\.(png|jpe?g)$/;

module.exports = function (dirList) {
  var files = [];
  dirList.forEach(function (dir) {
    var dirFiles = fs.readdirSync(dir);
    dirFiles = dirFiles.filter(function (file) {
      return imageSuffixRegex.test(file);
    });
    dirFiles = dirFiles.map(function (file) {
      return dir + file;
    });

    files = files.concat(dirFiles);
  });

  return files;
};
