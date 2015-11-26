#!/usr/bin/env node

var fs = require('fs');
var glob = require('glob');
var chalk = require('chalk');
var path = require('path');
var tmp = require('tmp');
var spawn = require('child_process').spawn;
var replaceExt = require('replace-ext');
var PDFImage = require('pdf-image').PDFImage;
var modes = {
  'pdf': function (source, target) {
    debug('Original renamed.');
    fs.rename(source, target);
  },
  'png': function (source, target) {
    var pdfImage = new PDFImage(source);
    pdfImage.convertPage(0).then(function (imagePath) {
      info('Image converted');
      fs.rename(imagePath, target);

      if (source !== target) {
        fs.unlinkSync(source);
        debug('Original source deleted.');
      }
    }, function (err) {
      warn(chalk.red(err.message));
    });
  }
};
var argv = require('yargs').
           demand(1).
           usage('Usage: $0 [input] [output] -m [mode] -e [engine] -t [template] -v').
           default('m', 'pdf').
           alias('m', 'mode').
           describe('m', 'Sets the output mode, i.e., which kind of file should be created.').
           choices('m', Object.keys(modes)).
           default('e', 'pdflatex').
           alias('e', 'engine').
           describe('e', 'Sets the engine for compiling the tex file.').
           alias('t', 'template').
           describe('t', 'Sets the template file to use for generating the tex file.').
           count('verbose').
           alias('v', 'verbose').
           help('h').
           alias('h', 'help').
           epilog('Copyright (c) 2015, Florian Rappl').
           argv;

var verbose = argv.verbose;
var mode = modes[argv.m];
var input = argv._[0];
var dir = path.dirname(input);
var output = replaceExt(argv._[1] || input, '.pdf');
var program = argv.e;
var template = ["\\documentclass[crop,tikz]{standalone}",
                "\\renewcommand{\\familydefault}{\\sfdefault}",
                "\\usepackage{pgfplots}",
                "\\usepgfplotslibrary{groupplots}",
                "\\usepgfplotslibrary{patchplots}",
                "\\usetikzlibrary{arrows,positioning,pgfplots.polar,matrix}",
                "\\pgfplotsset{",
                "  compat=newest,",
                "  y axis style/.style={yticklabel style=#1, ylabel style=#1, y axis line style=#1, ytick style=#1},",
                "  legend style={draw=none, legend pos=outer north east, font=\\small }",
                "}",
                "\\begin{document}",
                "\\input{$inputFile}",
                "\\end{document}"].join('\n');

function checkExists (file) {
  try { 
    fs.statSync(file); 
  } catch (_) { 
    warn(chalk.red('The file %s could not be found.'), file); 
  }
}

function warn() { 
  verbose >= 0 && console.log.apply(console, arguments);
}

function info() { 
  verbose >= 1 && console.log.apply(console, arguments); 
}

function debug() { 
  verbose >= 2 && console.log.apply(console, arguments); 
}

checkExists(input);

if (argv.template !== undefined) {
  checkExists(argv.template);
  template = fs.readFileSync(argv.template);
}

tmp.file({ mode: 0644, postfix: '.tex', dir: dir }, function (err, path, fd, cleanupCallback) {
  if (err) throw err;

  debug('Temporary file created: %s', path);
 
  var content = template.replace(/\$inputFile/, input);

  fs.writeFile(path, content, function (err) {
    if (err) throw err;

    fs.close(fd);
    var tex = spawn(program, [path]);
    var alive = true;

    tex.stdout.on('data', function (data) {
      var ds = data.toString();

      if (ds[ds.length - 2] === '?') {
        alive = false;
        warn(chalk.red(ds));
        tex.stdin.write('x\n');
      } else {
        info(chalk.blue(ds));
      }
    });

    tex.stderr.on('data', function (data) {
      warn(chalk.red(data.toString()));
    });

    tex.on('exit', function (code) {
      var target = argv._[1] || replaceExt(input, '.' + argv.m);

      if (alive) {
        fs.rename(replaceExt(path, '.pdf'), output);
      }

      debug('Renamed PDF from temporary file name to %s.', output);

      glob(replaceExt(path, '.*'), function (err, files) {
        if (err) throw err;

        files.forEach(function (file) {
          fs.unlinkSync(file);
          debug('Removed file %s.', file);
        });

        info('Deleted temporary files.');
      });

      if (alive) {
        mode(output, target);
      }
    });
  });
});