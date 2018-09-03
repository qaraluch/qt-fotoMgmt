const chalk = require("chalk");
const path = require("path");

const log = require("fancy-log");
// [js-cli/fancy-log: Log things, prefixed with a timestamp](https://github.com/js-cli/fancy-log)
// npm i fancy-log -S

const through = require("through2");
// [rvagg/through2](https://github.com/rvagg/through2)
// npm i through2 -S

// const exif = require("gulp-exif");
// [shimonenator/gulp-exif: Extract EXIF data from photographs](https://github.com/Shimonenator/gulp-exif)
// npm i gulp-exif -S

const exiftool = require("node-exiftool");
const exiftoolBin = require("dist-exiftool");
//[Sobesednik/node-exiftool: A Node.js interface to exiftool command-line application.](https://github.com/Sobesednik/node-exiftool)
// npm i node-exiftool

const lazypipe = require("lazypipe");
// [OverZealous/lazypipe: Lazily create a pipeline out of reusable components. Useful for gulp.](https://github.com/OverZealous/lazypipe)
// npm i lazypipe -S

const exifCustom = () => {
  let stream = through.obj(async (file, enc, cb) => {
    const ep = new exiftool.ExiftoolProcess(exiftoolBin);
    await ep.open();
    const exifData = await ep.readMetadata(file.path, ["-File:all"]);
    file.exif = exifData;
    await ep.close();
    cb(null, file);
  });
  return stream;
};

const renameFiles = () => {
  let stream = through.obj((file, enc, cb) => {
    let basename = path.relative(file.base, file.path);
    let extension = path.extname(file.path);
    // let exifDate = file.exif.exif.DateTimeOriginal;
    let exifDate = file.exif.data[0].TrackCreateDate;
    let newFile;
    if (exifDate) {
      let newBaseName = exifDate
        .replace(/(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3")
        .replace(/(\d{2}):(\d{2}):(\d{2})/, "$1.$2.$3")
        .concat("-0"); // my photo version placeholder
      // end format: 2017-11-29 12.59.27-0
      log(`      - original file name:           ${chalk.yellow(basename)}`);
      log(`      - found exif.DateTimeOriginal:  ${exifDate}`);
      log(
        `      - new file name:                ${chalk.green(
          newBaseName + extension
        )}`
      );
      newFile = file.clone({ contents: false });
      newFile.path = `${file.base}/${newBaseName}${extension}`;
      // let apath = `${file.base}/${newBaseName}${extension}`;
    } else {
      newFile = file;
    }
    cb(null, newFile);
  });
  return stream;
};

module.exports = function renameAfterExifDate() {
  return lazypipe()
    .pipe(exifCustom)
    .pipe(renameFiles);
};
