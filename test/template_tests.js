var template = require('../lib/template');
var path = require('path');

module.exports = {
  'Find All Relative Template Paths': function (test) {
    var file = 'template.tex';
    var paths = template.paths(file);
    test.strictEqual(paths.length, 3);
    test.done();
  },
  'Find All Absolute Template Paths': function (test) {
    var file = path.resolve('template.tex');
    var paths = template.paths(file);
    test.strictEqual(paths.length, 1);
    test.done();
  },
  'Load Invalid Paths Template Fails': function (test) {
    var files = ['foo.tex', 'foobar.tex'];
    var content = template.load(files);
    test.strictEqual(content, undefined);
    test.done();
  },
  'Load Valid Path Template Succeeds': function (test) {
    var files = ['test/template.tex'];
    var content = template.load(files);
    test.notStrictEqual(content, undefined);
    test.done();
  },
  'Load Template From Invalid Absolute Path Fails': function (test) {
    var file = path.resolve('test/default.tex');
    var content = template.read(file);
    test.strictEqual(content, undefined);
    test.done();
  },
  'Load Template From Invalid Absolute Path Without Extension Fails': function (test) {
    var file = path.resolve('test/default');
    var content = template.read(file);
    test.strictEqual(content, undefined);
    test.done();
  },
  'Load Template From Valid Relative Path Succeeds': function (test) {
    var file = 'default.tex';
    var content = template.read(file);
    test.notStrictEqual(content, undefined);
    test.done();
  },
  'Load Template From Valid Relative Path Without Extension Succeeds': function (test) {
    var file = 'default';
    var content = template.read(file);
    test.notStrictEqual(content, undefined);
    test.done();
  },
  'Load Valid Path Template Succeeds': function (test) {
    var files = ['test/template.tex'];
    var content = template.load(files);
    test.notStrictEqual(content, undefined);
    test.done();
  },
  'Load Valid Path Template Without Extension Succeeds': function (test) {
    var files = ['test/template'];
    var content = template.load(files);
    test.notStrictEqual(content, undefined);
    test.done();
  },
  'Load Invalid Path Template Without Extension Fails': function (test) {
    var files = ['test/templater'];
    var content = template.load(files);
    test.strictEqual(content, undefined);
    test.done();
  },
  'Load Template From Invalid Absolute Path Fails': function (test) {
    var file = path.resolve('test/default.tex');
    var content = template.read(file);
    test.strictEqual(content, undefined);
    test.done();
  },
  'Transform Template With Legal Content': function (test) {
    var templateContent = '\\input{file}';
    var content = template.transform(templateContent, 'foo');
    test.strictEqual(content, '\\input{foo}');
    test.done();
  },
  'Transform Template With Windows Backslash To Legal Content': function (test) {
    var templateContent = '\\input{file}';
    var content = template.transform(templateContent, '.\\foo.tikz');
    test.strictEqual(content, '\\input{foo.tikz}');
    test.done();
  },
  'Transform Template With Legal Content And More': function (test) {
    var templateContent = 'abc\n\\input{file}\n\ndef';
    var content = template.transform(templateContent, 'foo');
    test.strictEqual(content, 'abc\n\\input{foo}\n\ndef');
    test.done();
  },
  'Transform Template With Illegal Content': function (test) {
    var templateContent = 'Test Bar';
    var content = template.transform(templateContent, 'foo');
    test.strictEqual(content, templateContent);
    test.done();
  }
};