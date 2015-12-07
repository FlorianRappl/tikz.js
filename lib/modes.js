var fs = require('fs');
var PDFImage = require('pdf-image').PDFImage;

module.exports = {
  'pdf': function (source, target) {
    var emitter = this;
    emitter.emit('debug', 'Original renamed.');
    fs.rename(source, target);
    emitter.emit('done', target);
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
      emitter.emit('error', err.message);
    });
  }
};