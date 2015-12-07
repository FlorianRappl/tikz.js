var fs = require('fs');
var path = require('path');
var util = require('util');
var tmp = require('tmp');
var events = require('events');
var replaceExt = require('replace-ext');

var modes = require('./modes');
var exists = require('./exists');
var loadTemplate = require('./template');
var runLaTeX = require('./run-tex');

var TikZ = function (input, output, program, template, mode) {
  events.EventEmitter.call(this);

  this.template = template;
  this.input = input;
  this.output = output;
  this.program = program;
  this.template = template;
  this.mode = mode;
};

TikZ.prototype.__proto__ = events.EventEmitter.prototype;
TikZ.prototype.start = function () {
  var self = this;

  if (!exists(self.input)) {
    self.emit('error', util.format('The file %s could not be found.', input));
  } else if (!self.template) {
    self.emit('error', util.format('A valid template file named %s could not be found.', template));
  } else {
    var dir = path.dirname(self.input);
    var options = { 
      mode: 0644, 
      postfix: '.tex', 
      dir: dir 
    };
    var content = self.template.replace(/\\input{file}/, '\\input{' + self.input + '}');

    tmp.file(options, function (err, target, fd, cleanupCallback) {
      if (err) {
        self.emit('error', err);
        return;
      }

      self.emit('debug', util.format('Temporary file created: %s', target));
     

      fs.writeFile(target, content, function (err) {
        if (err) {
          self.emit('error', err);
          return;
        }

        fs.close(fd);
        runLaTeX(self);
      });
    });
  }
};

module.exports = function (args) {
  var input = args.input || 'input.tikz';
  var output = args.output || args.input || 'output.pdf';
  var program = args.program || 'pdflatex';
  var template = loadTemplate(args.template || 'default.tex');
  var mode = args.mode || 'pdf';

  return new TikZ(
    input,
    replaceExt(output, '.' + mode),
    program,
    template,
    modes[mode]);
};
module.exports.modes = Object.keys(modes);