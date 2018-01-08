var fs = require("fs");
const stripJsonComments = require("strip-json-comments");
// [sindresorhus/strip-json-comments](https://github.com/sindresorhus/strip-json-comments)
// npm i strip-json-comments -S

module.exports = function loadPaths(path) {
  return JSON.parse(stripJsonComments(fs.readFileSync(path, "utf8")));
};
