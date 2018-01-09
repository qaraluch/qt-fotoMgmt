const debug = require("gulp-debug");
// [sindresorhus/gulp-debug: ](https://github.com/sindresorhus/gulp-debug)
// npm i gulp-debug -D

module.exports = function logFile() {
  return debug({ title: "  - " });
};
