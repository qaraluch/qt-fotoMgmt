/* eslint-disable no-console */
var fs = require("fs");
const chalk = require("chalk");
const path = require("path");

const stripJsonComments = require("strip-json-comments");
// [sindresorhus/strip-json-comments](https://github.com/sindresorhus/strip-json-comments)
// npm i strip-json-comments -S

function suffixFilename(myPath, suffix) {
  let { dir, name, ext } = path.parse(myPath);
  return path.join(dir, name + "-" + suffix + ext);
}

module.exports = function loadPaths(configPath, enviroment) {
  const env = process.env[enviroment];
  const mode = env === "dev" ? "dev" : env === "prod" ? "prod" : "dev";
  console.log(`[ ! ] Runing in ${chalk.red(mode)} mode!`);
  const thePath =
    mode === "dev" ? `${suffixFilename(configPath, "dev")}` : configPath;
  console.log(`      - loading paths file: ${thePath}`);
  return JSON.parse(stripJsonComments(fs.readFileSync(thePath, "utf8")));
};
