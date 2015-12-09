var fs = require('fs');
var path = require('path');

module.exports = {
  exists: function (file) {
    try { 
      fs.statSync(file);
      return true;
    } catch (_) {
      return false;
    }
  },
  isAbsolute: function (file) {
    var dir = path.resolve(file);
    return path.normalize(file) === path.normalize(dir);
  }
};