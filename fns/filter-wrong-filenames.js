const path = require("path");
const chalk = require("chalk");

const filter = require("gulp-filter");
// [sindresorhus/gulp-filter: Filter files in a vinyl stream](https://github.com/sindresorhus/gulp-filter)
// npm i gulp-filter -S

const log = require("fancy-log");
// [js-cli/fancy-log: Log things, prefixed with a timestamp](https://github.com/js-cli/fancy-log)
// npm i fancy-log -S

module.exports = function filterWrongFileNames(regex) {
  const filterFiles = file => {
    let test = regex.test(file.path);
    test ||
      log(
        `      - detected wrong file name: ${chalk.yellow(
          path.relative(file.base, file.path)
        )}`
      );
    return test;
  };
  return filter(filterFiles, { dot: true });
};
