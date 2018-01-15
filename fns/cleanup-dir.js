const del = require("del");
// https://github.com/sindresorhus/del
// npm i del -S

module.exports = function cleanUpDir(path) {
  return del(path, { force: true });
};
