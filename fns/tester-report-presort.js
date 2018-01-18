const chalk = require("chalk");

const log = require("fancy-log");
// [js-cli/fancy-log: Log things, prefixed with a timestamp](https://github.com/js-cli/fancy-log)
// npm i fancy-log -S

module.exports = function presortTesterReport(counters) {
  const { cu, mp4s, left, jpgs } = counters;
  const test = cu === mp4s + left + jpgs;
  if (test) log(`Tests: ${chalk.green("OK")}`);
  else log(`Tests: ${chalk.red("Not OK")}`);
  log("Files count from CU: ", cu);
  log(`${test ? chalk.green("equals") : chalk.red("not equals")} of sum of:`);
  log("   - jpgs:", jpgs);
  log("   - mp4s:", mp4s);
  log("   - left:", left);
  test || log(`${chalk.red("Double check results!!!")}`);
};
