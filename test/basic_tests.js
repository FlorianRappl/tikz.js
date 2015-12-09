var tikz = require('../lib/tikz');
var fs = require('fs');
var path = require('path');

module.exports = {
  'Build Simple PDF with API': function (test) {
    var source = 'test/image.tikz';
    var target = path.normalize('test/image.pdf');
    var p = tikz({
      input: source
    });

    p.on('done', function (file) {
      fs.statSync(file);
      fs.unlinkSync(file);
      test.strictEqual(file, target);
      test.done();
    });

    p.on('error', function (error) {
      test.ok(false, error);
      test.done();
    });

    p.start();
  },
  'Build Renamed PDF with API': function (test) {
    var source = 'test/image.tikz';
    var target = path.normalize('test/foo.pdf');
    var p = tikz({
      input: source,
      output: 'test/foo.pdf'
    });

    p.on('done', function (file) {
      fs.statSync(file);
      fs.unlinkSync(file);
      test.strictEqual(file, target);
      test.done();
    });

    p.on('error', function (error) {
      test.ok(false, error);
      test.done();
    });

    p.start();
  },
  'Build Localized Renamed PDF with API': function (test) {
    var source = 'test/image.tikz';
    var target = path.normalize('test.pdf');
    var p = tikz({
      input: source,
      output: 'test.pdf'
    });

    p.on('done', function (file) {
      fs.statSync(file);
      fs.unlinkSync(file);
      test.strictEqual(file, target);
      test.done();
    });

    p.on('error', function (error) {
      test.ok(false, error);
      test.done();
    });

    p.start();
  }
};