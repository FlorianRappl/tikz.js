var spawn = require('child_process').spawn;
var fs = require('fs');
var glob = require('glob');
var replaceExt = require('replace-ext');

module.exports = function (self) {
  var tex = spawn(self.program, [target]);
  var alive = true;

  tex.stdout.on('data', function (data) {
    var ds = data.toString();

    if (ds[ds.length - 2] === '?') {
      alive = false;
      self.emit('warn', ds);
      tex.stdin.write('x\n');
    } else {
      self.emit('info', ds);
    }
  });

  tex.stderr.on('data', function (data) {
    self.emit('warn', data.toString());
  });

  tex.on('exit', function (code) {
    var destination = self.output;
    var original = replaceExt(target, '.pdf');

    glob(replaceExt(target, '.*'), function (err, files) {
      if (err) {
        throw err;
      }

      files.forEach(function (file) {
        if (file !== original) {
          fs.unlinkSync(file);
          self.emit('debug', util.format('Removed file %s.', file)); 
        }
      });

      self.emit('info', 'Deleted temporary files.');
    });

    if (alive) {
      self.mode.call(self, self.output, destination);
    } else {
      self.emit('error');
    }
  });
};