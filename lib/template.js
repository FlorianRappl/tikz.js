var fs = require('fs');
var path = require('path');
var fn = require('./filename');
var replaceExt = require('replace-ext');

function findTemplates (templatePath) {
  var templatePaths = [];

  if (!fn.isAbsolute(templatePath)) {
    templatePaths.push(path.join(process.cwd(), templatePath));
    templatePaths.push(path.join(__dirname, templatePath));
    templatePaths.push(path.join(__dirname, '../templates', templatePath));
  } else {
    templatePaths.push(templatePath);
  }

  return templatePaths;
}

function loadTemplate (templatePaths) {
  for (var i = 0; i < templatePaths.length; ++i) {
    if (fn.exists(templatePaths[i])) {
      return fs.readFileSync(templatePaths[i], 'utf8');
    }

    if (path.extname(templatePaths[i]) !== '.tex') {
      templatePaths[i] = replaceExt(templatePaths[i], '.tex');
      --i;
    }
  }  
}

function readTemplate (templatePath) {
  var paths = findTemplates(templatePath);
  return loadTemplate(paths);
}

function transformTemplate (template, file) {
  var origin = /\\input{file}/;
  var target = '\\input{' + file + '}';
  return template.replace(origin, target);
}

module.exports = {
  paths: findTemplates,
  load: loadTemplate,
  read: readTemplate,
  transform: transformTemplate
};