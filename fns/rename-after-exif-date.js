const chalk = require("chalk");
const path = require("path");

const log = require("fancy-log");
// [js-cli/fancy-log: Log things, prefixed with a timestamp](https://github.com/js-cli/fancy-log)
// npm i fancy-log -S

const through = require("through2");
// [rvagg/through2](https://github.com/rvagg/through2)
// npm i through2 -S

const exif = require("gulp-exif");
// [shimonenator/gulp-exif: Extract EXIF data from photographs](https://github.com/Shimonenator/gulp-exif)
// npm i gulp-exif -S

const lazypipe = require("lazypipe");
// [OverZealous/lazypipe: Lazily create a pipeline out of reusable components. Useful for gulp.](https://github.com/OverZealous/lazypipe)
// npm i lazypipe -S

const renameFiles = () => {
  let stream = through.obj((file, enc, cb) => {
    let basename = path.relative(file.base, file.path);
    let extension = path.extname(file.path);
    let exifDate = file.exif.exif.DateTimeOriginal;
    let newBaseName = exifDate
      .replace(/(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3")
      .replace(/(\d{2}):(\d{2}):(\d{2})/, "$1.$2.$3")
      .concat("-0"); // my photo version placeholder
    // end format: 2017-11-29 12.59.27-0
    log(`      -  original file name:           ${chalk.yellow(basename)}`);
    log(`      -  found exif.DateTimeOriginal:  ${exifDate}`);
    log(
      `      -  new file name:                ${chalk.green(
        newBaseName + extension
      )}`
    );
    let newFile = file;
    newFile.path = `${file.base}/${newBaseName}${extension}`;
    cb(null, newFile);
  });
  return stream;
};

module.exports = function renameAfterExifDate() {
  return lazypipe()
    .pipe(exif)
    .pipe(renameFiles);
};
