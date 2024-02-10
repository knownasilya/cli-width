import tty from 'node:tty';

export default function cliWidth(options) {
  const opts = normalizeOpts(options);

  if (
    opts.output &&
    'getWindowSize' in opts.output &&
    typeof opts.output.getWindowSize === 'function'
  ) {
    return opts.output.getWindowSize()[0] || opts.defaultWidth;
  }

  if (
    opts.tty &&
    'getWindowSize' in opts.tty &&
    typeof opts.tty.getWindowSize === 'function'
  ) {
    return opts.tty.getWindowSize()[1] || opts.defaultWidth;
  }

  if (opts.output.columns) {
    return opts.output.columns;
  }

  if (process.env.CLI_WIDTH) {
    const width = parseInt(process.env.CLI_WIDTH, 10);

    if (!isNaN(width) && width !== 0) {
      return width;
    }
  }

  return opts.defaultWidth;
}

function normalizeOpts(options) {
  const defaultOpts = {
    defaultWidth: 0,
    output: process.stdout,
    tty,
  };

  if (!options) {
    return defaultOpts;
  }

  Object.keys(defaultOpts).forEach(function (key) {
    if (!options[key]) {
      options[key] = defaultOpts[key];
    }
  });

  return options;
}
