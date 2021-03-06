#!/usr/bin/env node

var tikz = require('../lib/tikz');
var chalk = require('chalk');
var argv = require('yargs').
           demand(1).
           usage('Usage: $0 [input] [output] -m [mode] -e [engine] -t [template] -v').
           default('m', 'pdf').
           choices('m', tikz.modes).
           default('e', 'pdflatex').
           default('t', 'default').
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
var conversion = tikz({
  input: argv._[0],
  output: argv._[1],
  mode: argv.m,
  program: argv.e,
  template: argv.template,
});

conversion.on('warn', function (message) {
  verbose >= 0 && console.log(chalk.red(message));
});

conversion.on('info', function (message) {
  verbose >= 1 && console.log(chalk.blue(message)); 
});

conversion.on('debug', function (message) {
  verbose >= 2 && console.log(chalk.yellow(message)); 
});

conversion.on('error', function (error) {
  console.log(chalk.red(error));
  process.exit(1);
});

conversion.on('done', function (file) {
  console.log('File %s created.', file);
  process.exit(0);
});

conversion.start();