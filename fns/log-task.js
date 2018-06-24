const log = require("fancy-log");
// [js-cli/fancy-log: Log things, prefixed with a timestamp](https://github.com/js-cli/fancy-log)
// npm i fancy-log -S

const chalk = require("chalk");

const types = {
  done: `[ ${chalk.green("✔")} ] `,
  fail: `[ ${chalk.red("✖")} ] `,
  warn: `[ ${chalk.yellow("!")} ] `,
  start: `[ ${chalk.blue("\u2022")} ] `
};

module.exports = function logTask(msg = "!msg not defined", options = {}) {
  return () => {
    const { color = "yellow", task = "none", emptyLineAfter = true } = options;
    const sign = types[task] || "";
    const msgLine = `${sign}${chalk[color](msg)}`;
    if (emptyLineAfter) {
      log(`${msgLine}\n`);
    } else {
      log(`${msgLine}`);
    }
    return Promise.resolve();
  };
};
