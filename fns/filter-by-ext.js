const filter = require("gulp-filter");
// [sindresorhus/gulp-filter: Filter files in a vinyl stream](https://github.com/sindresorhus/gulp-filter)
// npm i gulp-filter -S

module.exports = function filterByExt(ext) {
  return filter(`**/*${ext}`, { dot: true });
};
