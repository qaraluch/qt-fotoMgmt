const log = require("fancy-log");
// [js-cli/fancy-log: Log things, prefixed with a timestamp](https://github.com/js-cli/fancy-log)
// npm i fancy-log -S

const chalk = require("chalk");

const types = {
  done: `[ ${chalk.green("✔")} ] `,
  fail: `[ ${chalk.red("✖")} ] `,
  warn: `[ ${chalk.yellow("!")} ] `
};

module.exports = function logTask(msg = "!msg not defined", options = {}) {
  return () => {
    const { color = "yellow", task = "none" } = options;
    const sign = types[task] || "";
    log(`${sign}${chalk[color](msg)}\n`);
    return Promise.resolve();
  };
};
