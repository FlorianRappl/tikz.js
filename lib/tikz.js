var fs = require('fs');
var path = require('path');
var util = require('util');
var tmp = require('tmp');
var events = require('events');
var replaceExt = require('replace-ext');

var modes = require('./modes');
var fn = require('./filename');
var template = require('./template');
var runLaTeX = require('./run-tex');

var TikZ = function (inputPath, outputPath, programName, templatePath, mode) {
  events.EventEmitter.call(this);

  this.templatePath = templatePath;
  this.inputPath = inputPath;
  this.outputPath = outputPath;
  this.programName = programName;
  this.mode = mode;
};

TikZ.prototype.__proto__ = events.EventEmitter.prototype;
TikZ.prototype.start = function () {
  var self = this;
  var templateContent = template.read(self.templatePath);

  if (!fn.exists(self.inputPath)) {
    self.emit('error', util.format('The file %s could not be found.', self.inputPath));
  } else if (!templateContent) {
    self.emit('error', util.format('A valid template file named %s could not be found.', self.templatePath));
  } else {
    var dir = path.dirname(self.inputPath);
    var content = template.transform(templateContent, self.inputPath);
    var options = { 
      mode: 0644,
      postfix: '.tex', 
      dir: dir
    };

    tmp.file(options, function (err, target, fd, cleanupCallback) {
      if (err) {
        return self.emit('error', err);
      }

      self.emit('debug', util.format('Temporary file created: %s', target));

      fs.writeFile(target, content, function (err) {
        if (err) {
          return self.emit('error', err);
        }

        fs.close(fd);
        runLaTeX(self, target);
      });
    });
  }
};

module.exports = function (args) {
  var input = args.input || 'input.tikz';
  var output = args.output || args.input || 'output.pdf';
  var program = args.program || 'pdflatex';
  var template = args.template || 'default.tex';
  var mode = args.mode || 'pdf';

  return new TikZ(
    input,
    replaceExt(output, '.' + mode),
    program,
    template,
    modes[mode]);
};
module.exports.modes = Object.keys(modes);