const chalk = require("chalk");
const path = require("path");

const log = require("fancy-log");
// [js-cli/fancy-log: Log things, prefixed with a timestamp](https://github.com/js-cli/fancy-log)
// npm i fancy-log -S

const through = require("through2");
// [rvagg/through2](https://github.com/rvagg/through2)
// npm i through2 -S

module.exports = function logFile(msg = " - ") {
  let stream = through.obj((file, enc, cb) => {
    const basename = path.basename(file.path);
    log(`${msg}${chalk.reset(basename)}.`);
    cb(null, file);
  });
  return stream;
};
