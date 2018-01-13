const log = require("fancy-log");
// [js-cli/fancy-log: Log things, prefixed with a timestamp](https://github.com/js-cli/fancy-log)
// npm i fancy-log -S

const chalk = require("chalk");

const through = require("through2");
// [rvagg/through2](https://github.com/rvagg/through2)
// npm i through2 -S

const types = {
  done: `[ ${chalk.green("✔")} ] `,
  fail: `[ ${chalk.red("✖")} ] `,
  warn: `[ ${chalk.yellow("!")} ] `
};

module.exports = function logMsg(msg = "!msg not defined", options = {}) {
  const { color = "yellow", task = "none" } = options;
  const sign = types[task] || "";
  log(`${sign}${chalk[color](msg)}`);
  return through.obj();
};
