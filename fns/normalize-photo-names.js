const chalk = require("chalk");
const path = require("path");

const log = require("fancy-log");
// [js-cli/fancy-log: Log things, prefixed with a timestamp](https://github.com/js-cli/fancy-log)
// npm i fancy-log -S

const through = require("through2");
// [rvagg/through2](https://github.com/rvagg/through2)
// npm i through2 -S

const regex = /(\d{4}-\d{2}-\d{2}\s\d{2}\.\d{2}\.\d{2})(-\d)?(.+)?/;

module.exports = function normalizePhotoNames(options) {
  const defaultOptions = {
    minimalLog: true
  };
  const endOptions = Object.assign({}, defaultOptions, options);
  const { minimalLog } = endOptions;

  let stream = through.obj((file, enc, cb) => {
    const extension = path.extname(file.path);
    // const basename = path.relative(file.base, file.path);
    const basenameNoExt = path.basename(file.path, extension);
    const regResults = regex.exec(basenameNoExt);
    const date = regResults[1];
    const version = regResults[2];
    const comment = regResults[3];
    minimalLog || log(`      - date:            ${chalk.reset(date)}`);
    minimalLog ||
      log(`      - version:         ${chalk.reset(version || "n/a")}`);
    minimalLog ||
      log(`      - comment:         ${chalk.reset(comment || "n/a")}`);

    let newFile = file;
    let newVersion = version || "-0";
    let commentClean =
      comment &&
      comment
        .replace(/(-|—)/, "")
        .trim()
        .replace(/^/, " - ");
    let newComment = commentClean || "";
    let newBaseName = `${date}${newVersion}${newComment}${extension}`;
    newFile.path = `${file.dirname}/${newBaseName}`; //not file.base!
    log(`      - normalized name: ${chalk.green(newBaseName)}`);
    cb(null, file);
  });
  return stream;
};
