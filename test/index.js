'use strict';

var tty = require('tty');
var test = require('tape');
var lib = require('../');


test('uses process.stdout.getWindowSize', function (t) {
  // mock stdout.getWindowSize
  process.stdout.getWindowSize = function () {
    return [100];
  };

  t.equal(lib(), 100, 'equal to mocked, 100');
  t.end();
});

test('uses defaultWidth if process.stdout.getWindowSize reports width of 0', function (t) {
  process.stdout.getWindowSize = function () {
    return [0];
  };

  t.equal(lib({ defaultWidth: 10 }), 10, 'equal to mocked, 10');
  t.end();
})

test('uses tty.getWindowSize', function (t) {
  process.stdout.getWindowSize = undefined;
  tty.getWindowSize = function () {
    return [3, 5];
  };

  t.equal(lib(), 5, 'equal to mocked, 5');
  t.end();
});

test('uses default if tty.getWindowSize reports width of 0', function (t) {
  process.stdout.getWindowSize = undefined;
  tty.getWindowSize = function () {
    return [0, 0];
  };

  t.equal(lib({ defaultWidth: 10 }), 10, 'equal to mocked, 10');
  t.end();
})

test('uses custom env var', function (t) {
  var oldWidth = process.stdout.columns;
  process.stdout.columns = undefined;
  tty.getWindowSize = undefined;
  process.env.CLI_WIDTH = 30;

  t.equal(lib(), 30, 'equal to mocked, 30');

  delete process.env.CLI_WIDTH;
  process.stdout.columns = oldWidth;
  t.end();
});

test('uses default if env var is not a number', function (t) {
  var oldWidth = process.stdout.columns;
  process.stdout.columns = undefined;
  process.env.CLI_WIDTH = 'foo';

  t.equal(lib(), 0, 'default unset value, 0');

  delete process.env.CLI_WIDTH;
  process.stdout.columns = oldWidth;
  t.end();
});

test('uses default', function (t) {
  var oldWidth = process.stdout.columns;
  process.stdout.columns = undefined;
  tty.getWindowSize = undefined;

  t.equal(lib(), 0, 'default unset value, 0');

  process.stdout.columns = oldWidth;
  t.end();
});

test('uses overridden default', function (t) {
  var oldWidth = process.stdout.columns;
  process.stdout.columns = undefined;

  t.equal(lib({ defaultWidth: 10 }), 10, 'user-set defaultWidth value, 10');

  process.stdout.columns = oldWidth;
  t.end();
});

test('uses user-configured output stream', function (t) {
  var outputMock = {
      getWindowSize: function () {
          return [10];
      }
  };

  t.equal(lib({ output: outputMock }), 10, 'user-set output stream, 10');

  t.end();
});

test('uses user-configured tty', function (t) {
  var ttyMock = {
      getWindowSize: function () {
          return [2, 5];
      }
  };

  t.equal(lib({ tty: ttyMock }), 5, 'user-set tty, 5');

  t.end();
});

test('uses output.columns', function (t) {
  var oldWidth = process.stdout.columns;
  process.stdout.columns = 15;
  process.stdout.getWindowSize = undefined;
  delete process.env.CLI_WIDTH;

  t.equal(lib({ output: process.stdout }), 15, 'user-set output, 15');

  process.stdout.columns = oldWidth;
  t.end();
})
