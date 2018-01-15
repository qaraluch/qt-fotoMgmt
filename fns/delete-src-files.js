const vinylPaths = require("vinyl-paths");
//[sindresorhus/vinyl-paths: Get the file paths in a vinyl stream](https://github.com/sindresorhus/vinyl-paths)
// npm i vinyl-paths -S

const del = require("del");
// https://github.com/sindresorhus/del
// npm i del -S

module.exports = function deleteSrcFiles() {
  return vinylPaths(file => del(file, { force: true }));
};
