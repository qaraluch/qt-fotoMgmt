const chalk = require("chalk");

const log = require("fancy-log");
// [js-cli/fancy-log: Log things, prefixed with a timestamp](https://github.com/js-cli/fancy-log)
// npm i fancy-log -S

const through = require("through2");
// [rvagg/through2](https://github.com/rvagg/through2)
// npm i through2 -S

module.exports = function countFiles(msg = " - ", testerCb) {
  let count = 0;
  let stream = through.obj(
    (file, enc, cb) => {
      count++;
      cb(null, file);
    },
    cb => {
      log(`${msg}: ${chalk.magenta(count)} file(s).`);
      testerCb && testerCb(count);
      cb();
    }
  );
  return stream;
};
