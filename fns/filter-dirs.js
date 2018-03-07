const fs = require("fs");
const filter = require("gulp-filter");
// [sindresorhus/gulp-filter: Filter files in a vinyl stream](https://github.com/sindresorhus/gulp-filter)
// npm i gulp-filter -S

const throwErr = err => {
  throw new Error(`ifExists(): ${err.message}`);
};
const noENOENTexeption = err => (err.code === "ENOENT" ? false : throwErr(err));

function existsSync(filePath) {
  try {
    const rawStat = fs.statSync(filePath);
    const statMachined = fsStatObjectProcess(rawStat);
    return statMachined;
  } catch (err) {
    return noENOENTexeption(err);
  }
}

function fsStatObjectProcess(statObj) {
  const notFound = statObj || "notFound";
  const someResults =
    statObj && statObj.isDirectory()
      ? "dir"
      : statObj.isFile() ? "file" : "other";
  return statObj ? someResults : notFound;
}

module.exports = function filterDirs() {
  return filter(file => (existsSync(file.path) === "dir" ? false : true));
};
