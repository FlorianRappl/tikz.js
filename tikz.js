#!/usr/bin/env node

var tikz = require('./index.js');
var chalk = require('chalk');
var argv = require('yargs').
           demand(1).
           usage('Usage: $0 [input] [output] -m [mode] -e [engine] -t [template] -v').
           default('m', 'pdf').
           choices('m', tikz.modes).
           default('e', 'pdflatex').
           count('verbose').
           describe('m', 'Sets the output mode, i.e., which kind of file should be created.').
           describe('e', 'Sets the engine for compiling the tex file.').
           describe('t', 'Sets the template file to use for generating the tex file.').
           describe('v', 'Adjusts the verbosity level of the application.').
           help('h').
           alias('t', 'template').
           alias('m', 'mode').
           alias('e', 'engine').
           alias('v', 'verbose').
           alias('h', 'help').
           epilog('Copyright (c) 2015, Florian Rappl').
           argv;

var verbose = argv.verbose;

function warn () { 
  verbose >= 0 && console.log.apply(console, arguments);
}

function info () { 
  verbose >= 1 && console.log.apply(console, arguments); 
}

function debug () { 
  verbose >= 2 && console.log.apply(console, arguments); 
}

var conversion = tikz({
  input: argv._[0],
  mode: argv.m,
  output: argv._[1],
  program: argv.e,
  template: argv.template || 'template.tex',
});

conversion.on('warn', function (message) {
  warn(chalk.red(message));
});

conversion.on('info', function (message) {
  warn(chalk.blue(message));
});

conversion.on('debug', function (message) {
  warn(chalk.yellow(message));
});

conversion.start();