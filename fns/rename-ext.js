const chalk = require("chalk");

const rename = require("gulp-rename");
// [hparra/gulp-rename: Rename files easily](https://github.com/hparra/gulp-rename)
// npm i gulp-rename -S

const log = require("fancy-log");
// [js-cli/fancy-log: Log things, prefixed with a timestamp](https://github.com/js-cli/fancy-log)
// npm i fancy-log -S

module.exports = function renameExt(from, to) {
  const renameAndLogIt = path => {
    log(`    -  renamed file: ${chalk.green(path.basename + to)}`);
    return to;
  };
  return rename(path => {
    path.extname = path.extname === from ? renameAndLogIt(path) : path.extname;
  });
};
