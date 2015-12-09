var fs = require('fs');
var PDFImage = require('pdf-image').PDFImage;

module.exports = {
  'pdf': function (source, target) {
    var emitter = this;
    emitter.emit('debug', 'Original renamed.');
    fs.renameSync(source, target);
    return emitter.emit('done', target);
  },
  'png': function (source, target) {
    var emitter = this;
    var pdfImage = new PDFImage(source);
    pdfImage.convertPage(0).then(function (imagePath) {
      emitter.emit('info', 'Image converted.');
      fs.renameSync(imagePath, target);

      if (source !== target) {
        fs.unlinkSync(source);
        emitter.emit('debug', 'Original source deleted.');
      }

      return emitter.emit('done', target);
    }, function (err) {
      return emitter.emit('error', err.message);
    });
  }
};