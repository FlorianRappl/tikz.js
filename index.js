var fs = require('fs');
var glob = require('glob');
var path = require('path');
var util = require('util');
var tmp = require('tmp');
var events = require('events');
var spawn = require('child_process').spawn;
var replaceExt = require('replace-ext');
var PDFImage = require('pdf-image').PDFImage;
var modes = {
  'pdf': function (source, target) {
    this.emit('debug', 'Original renamed.');
    fs.rename(source, target);
    this.emit('done', target);
  },
  'png': function (source, target) {
    var emitter = this;
    var pdfImage = new PDFImage(source);
    pdfImage.convertPage(0).then(function (imagePath) {
    emitter.emit('info', 'Image converted.');
      fs.rename(imagePath, target);

      if (source !== target) {
        fs.unlinkSync(source);
        emitter.emit('debug', 'Original source deleted.');
      }

      emitter.emit('done', target);
    }, function (err) {
      emitter.emit('warn', err.message);
      emitter.emit('error');
    });
  }
};

function checkExists (file) {
  try { 
    fs.statSync(file);
    return true;
  } catch (_) {
    return false;
  }
}

var TikZ = function (input, output, program, template, mode) {
  events.EventEmitter.call(this);
  var templatePaths = [];

  if (!checkExists(input)) {
    this.emit('warn', util.format('The file %s could not be found.', input));
    return process.exit(1);
  }

  if (!path.isAbsolute(template)) {
    templatePaths.push(path.join(process.cwd(), template));
    templatePaths.push(path.join(__dirname, template));
    templatePaths.push(path.join(__dirname, 'templates', template));
  } else {
    templatePaths.push(template);
  }

  for (var i = 0; i < templatePaths.length; ++i) {
    if (checkExists(templatePaths[i])) {
      this.templateContent = fs.readFileSync(templatePaths[i]);
      break;
    }

    if (path.extname(templatePaths[i]) !== '.tex') {
      templatePaths[i] = replaceExt(templatePaths[i], '.tex');
      --i;
    }
  }

  if (!this.templateContent) {
    this.emit('warn', util.format('A valid template file named %s could not be found.', template));
    throw new Error('The provided template was invalid.');
  }

  this.dir = path.dirname(input);
  this.input = input;
  this.output = output;
  this.program = program;
  this.template = template;
  this.mode = mode;
};

TikZ.prototype.__proto__ = events.EventEmitter.prototype;
TikZ.prototype.start = function () {
  tmp.file({ mode: 0644, postfix: '.tex', dir: this.dir }, function (err, target, fd, cleanupCallback) {
    if (err) {
      throw err;
    }

    this.emit('debug', util.format('Temporary file created: %s', target));
   
    var content = this.templateContent.replace(/\\input{file}/, '\\input{' + this.input + '}');

    fs.writeFile(target, content, function (err) {
      if (err) {
        throw err;
      }

      fs.close(fd);
      var tex = spawn(this.program, [target]);
      var alive = true;

      tex.stdout.on('data', function (data) {
        var ds = data.toString();

        if (ds[ds.length - 2] === '?') {
          alive = false;
          this.emit('warn', ds);
          tex.stdin.write('x\n');
        } else {
          this.emit('info', ds);
        }
      });

      tex.stderr.on('data', function (data) {
        this.emit('warn', data.toString());
      });

      tex.on('exit', function (code) {
        var destination = this.output;
        var original = replaceExt(target, '.pdf');

        glob(replaceExt(target, '.*'), function (err, files) {
          if (err) {
            throw err;
          }

          files.forEach(function (file) {
            if (file !== original) {
              fs.unlinkSync(file);
              this.emit('debug', util.format('Removed file %s.', file)); 
            }
          });

          this.emit('info', 'Deleted temporary files.');
        });

        if (alive) {
          this.mode.call(this, this.output, destination);
        } else {
          this.emit('error');
        }
      });
    });
  });
};

var creator = function (args) {
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

creator.modes = Object.keys(modes);
module.exports = creator;