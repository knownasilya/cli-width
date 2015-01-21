'use strict';

exports.defaultWidth = 0;

module.exports = function () {
  if (process.stdout.getWindowSize) {
    return process.stdout.getWindowSize()[0];
  }
  else {
    var tty = require('tty');

    if (tty.getWindowSize) {
      return tty.getWindowSize()[1];
    }
    else {
      return exports.defaultWidth;
    }
  }
};
