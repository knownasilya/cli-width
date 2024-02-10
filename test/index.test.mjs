import tty from 'node:tty';
import { expect, test } from 'vitest';

import lib from '../index.mjs';

test('uses process.stdout.getWindowSize', function () {
  // mock stdout.getWindowSize
  process.stdout.getWindowSize = function () {
    return [100];
  };

  expect(lib(), 100, 'equal to mocked, 100');
});

test('uses defaultWidth if process.stdout.getWindowSize reports width of 0', function () {
  process.stdout.getWindowSize = function () {
    return [0];
  };

  expect(lib({ defaultWidth: 10 }), 10, 'equal to mocked, 10');
});

test('uses tty.getWindowSize', function () {
  process.stdout.getWindowSize = undefined;
  tty.getWindowSize = function () {
    return [3, 5];
  };

  expect(lib(), 5, 'equal to mocked, 5');
});

test('uses default if tty.getWindowSize reports width of 0', function () {
  process.stdout.getWindowSize = undefined;
  tty.getWindowSize = function () {
    return [0, 0];
  };

  expect(lib({ defaultWidth: 10 }), 10, 'equal to mocked, 10');
});

test('uses custom env var', function () {
  let oldWidth = process.stdout.columns;

  process.stdout.columns = undefined;
  tty.getWindowSize = undefined;
  process.env.CLI_WIDTH = 30;

  expect(lib(), 30, 'equal to mocked, 30');

  delete process.env.CLI_WIDTH;
  process.stdout.columns = oldWidth;
});

test('uses default if env var is not a number', function () {
  let oldWidth = process.stdout.columns;

  process.stdout.columns = undefined;
  process.env.CLI_WIDTH = 'foo';

  expect(lib(), 0, 'default unset value, 0');

  delete process.env.CLI_WIDTH;
  process.stdout.columns = oldWidth;
});

test('uses default', function () {
  let oldWidth = process.stdout.columns;

  process.stdout.columns = undefined;
  tty.getWindowSize = undefined;

  expect(lib(), 0, 'default unset value, 0');

  process.stdout.columns = oldWidth;
});

test('uses overridden default', function () {
  let oldWidth = process.stdout.columns;

  process.stdout.columns = undefined;

  expect(lib({ defaultWidth: 10 }), 10, 'user-set defaultWidth value, 10');

  process.stdout.columns = oldWidth;
});

test('uses user-configured output stream', function () {
  const outputMock = {
    getWindowSize: function () {
      return [10];
    },
  };

  expect(lib({ output: outputMock }), 10, 'user-set output stream, 10');
});

test('uses user-configured tty', function () {
  const ttyMock = {
    getWindowSize: function () {
      return [2, 5];
    },
  };

  expect(lib({ tty: ttyMock }), 5, 'user-set tty, 5');
});

test('uses output.columns', function () {
  let oldWidth = process.stdout.columns;

  process.stdout.columns = 15;
  process.stdout.getWindowSize = undefined;
  delete process.env.CLI_WIDTH;

  expect(lib({ output: process.stdout }), 15, 'user-set output, 15');

  process.stdout.columns = oldWidth;
});
