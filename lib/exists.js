var fs = require('fs');

module.exports = function (file) {
  try { 
    fs.statSync(file);
    return true;
  } catch (_) {
    return false;
  }
};