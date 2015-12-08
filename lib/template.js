var fs = require('fs');
var path = require('path');
var exists = require('./exists');

function isAbsolute(p) {
  var dir = path.resolve(p);
  return path.normalize(p + '/') === path.normalize(dir + '/');
}

module.exports = function (template) {
  var templatePaths = [];

  if (!isAbsolute(template)) {
    templatePaths.push(path.join(process.cwd(), template));
    templatePaths.push(path.join(__dirname, template));
    templatePaths.push(path.join(__dirname, '../templates', template));
  } else {
    templatePaths.push(template);
  }

  for (var i = 0; i < templatePaths.length; ++i) {
    if (exists(templatePaths[i])) {
      return fs.readFileSync(templatePaths[i], 'utf8');
    }

    if (path.extname(templatePaths[i]) !== '.tex') {
      templatePaths[i] = replaceExt(templatePaths[i], '.tex');
      --i;
    }
  }
};