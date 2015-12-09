var fn = require('../lib/filename');

module.exports = {
  'Sample File Exists': function (test) {
    var sample = 'test/image.tikz';
    var result = fn.exists(sample);
    test.ok(result);
    test.done();
  },
  'Arbitrary File Does Not Exist': function (test) {
    var sample = 'image_foo_bar_unavailable.tikz';
    var result = fn.exists(sample);
    test.ok(!result);
    test.done();
  },
  'Relative File Path Is Not Absolute': function (test) {
    var sample = '../foo.tikz';
    var result = fn.isAbsolute(sample);
    test.ok(!result);
    test.done();
  },
  'Absolute File Path Detected': function (test) {
    var sample = module.filename;
    var result = fn.isAbsolute(sample);
    test.ok(result);
    test.done();
  }
};