const chalk = require("chalk");

const rename = require("gulp-rename");
// [hparra/gulp-rename: Rename files easily](https://github.com/hparra/gulp-rename)
// npm i gulp-rename -S

const log = require("fancy-log");
// [js-cli/fancy-log: Log things, prefixed with a timestamp](https://github.com/js-cli/fancy-log)
// npm i fancy-log -S

const rgx = /(.+\.\d{2}-)(\d)/;

module.exports = function bumpFotoVersion(regex) {
  return rename(path => {
    const logIt = () =>
      log(`    -  bum version:  ${chalk.green(path.basename + path.extname)}`);
    let verNo = rgx.exec(path.basename);
    if (verNo) {
      const base = verNo && verNo[1];
      const ver = verNo && parseInt(verNo[2]) + 1;
      const newBase = `${base}${ver}`;
      path.basename = newBase;
      logIt();
    } else {
      path.basename += "-1";
      logIt();
    }
  });
};
