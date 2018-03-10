const chalk = require("chalk");
const path = require("path");

const log = require("fancy-log");
// [js-cli/fancy-log: Log things, prefixed with a timestamp](https://github.com/js-cli/fancy-log)
// npm i fancy-log -S

const through = require("through2");
// [rvagg/through2](https://github.com/rvagg/through2)
// npm i through2 -S

function processOptions(options) {
  const defaultOptions = {
    minimalLog: true
  };
  return Object.assign({}, defaultOptions, options);
}

const regex = /(\d{4}-\d{2}-\d{2}\s\d{2}\.\d{2}\.\d{2})(-\d)?(.+)?/;

function splitFileName(filePath) {
  const extension = path.extname(filePath);
  const basenameNoExt = path.basename(filePath, extension);
  const regResults = regex.exec(basenameNoExt);
  const date = regResults[1];
  const version = regResults[2];
  const comment = regResults[3];
  return { date, version, comment, extension };
}

function detailLogIt(params) {
  const { minimalLog, date, version, comment } = params;
  minimalLog || log(`      - date:            ${chalk.reset(date)}`);
  minimalLog ||
    log(`      - version:         ${chalk.reset(version || "n/a")}`);
  minimalLog ||
    log(`      - comment:         ${chalk.reset(comment || "n/a")}`);
}

function getParentName(fileBase) {
  const parentName = fileBase.split(path.sep).splice(-1);
  return parentName[0];
}

function detectDups(comment, parentName) {
  return comment.indexOf(parentName) > -1;
}

function getNewComment(comment, parentName) {
  let newComment;
  if (comment) {
    newComment = detectDups(comment, parentName)
      ? comment
      : ` - ${parentName}${comment}`;
  } else {
    newComment = ` - ${parentName}`;
  }
  return newComment;
}

module.exports = function renameAfterDirName(options) {
  const { minimalLog } = processOptions(options);

  let stream = through.obj((file, enc, cb) => {
    const fileNameParts = splitFileName(file.path);
    // const test = path.relative(file.base, file.path);
    const { date, version, comment, extension } = fileNameParts;
    detailLogIt({ minimalLog, ...fileNameParts });
    let newFile = file;
    const parentName = getParentName(file.dirname); //not file.base!
    const newComment = getNewComment(comment, parentName);
    let newBaseName = `${date}${version}${newComment}${extension}`;
    newFile.path = `${file.dirname}/${newBaseName}`; //not file.base!
    log(`      - added parent dir name: ${chalk.green(newBaseName)}`);
    cb(null, file);
  });

  return stream;
};
