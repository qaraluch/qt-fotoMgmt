/* eslint-disable no-console */

const gulp = require("gulp");
const path = require("path");
const chalk = require("chalk");

const rename = require("gulp-rename");
// [hparra/gulp-rename: Rename files easily](https://github.com/hparra/gulp-rename)
// npm i gulp-rename -S

const del = require("del");
// https://github.com/sindresorhus/del
// npm i del -S

const debug = require("gulp-debug");
// [sindresorhus/gulp-debug: Debug Vinyl file streams to see what files are run through your Gulp pipeline](https://github.com/sindresorhus/gulp-debug)
// npm i gulp-debug -D

const log = require("fancy-log");
// [js-cli/fancy-log: Log things, prefixed with a timestamp](https://github.com/js-cli/fancy-log)
// npm i fancy-log -S

const filter = require("gulp-filter");
// [sindresorhus/gulp-filter: Filter files in a vinyl stream](https://github.com/sindresorhus/gulp-filter)
// npm i gulp-filter -S

const vinylPaths = require("vinyl-paths");
//[sindresorhus/vinyl-paths: Get the file paths in a vinyl stream](https://github.com/sindresorhus/vinyl-paths)
// npm i vinyl-paths -S

const data = require("gulp-data");
//[colynb/gulp-data: ](https://github.com/colynb/gulp-data)
// npm i gulp-data -S

const tap = require("gulp-tap");
//[geejs/gulp-tap: Easily tap into a gulp pipeline without creating a plugin.](https://github.com/geejs/gulp-tap)
// npm i gulp-tap -S

const paths = {};

paths.fotosInCu = ".fotos/cu/**/*";
paths.fotosInCuTemp = ".fotos/cuTemp/**/*";
paths.cuTemp = ".fotos/cuTemp/";
paths.cuSort = ".fotos/cuSort/";

const cleanDir = path => del(path);
const cleanDir_cuTemp = () => cleanDir(paths.cuTemp);
const cleanDir_cuSort = () => cleanDir(paths.cuSort);

const markExtFor = (ext, what) => {
  let myData = {};
  return data(function(file) {
    const fileExt = path.extname(file.path);
    const fileName = path.relative(path.dirname(file.path), file.path);
    function logExtensionToMark() {
      log(`    -  marked file for ${what} : ${fileName}`);
      return true;
    }
    myData.markedExt = fileExt === ext ? logExtensionToMark() : false;
    return myData;
  });
};

const renameExt = (from, to) => {
  const renameAndLogIt = path => {
    log(`    -  renamed file: ${chalk.yellow(path.basename + to)}`);
    return to;
  };
  return rename(path => {
    path.extname = path.extname === from ? renameAndLogIt(path) : path.extname;
  });
};

const filterByExt = ext => filter(`**/*${ext}`, { dot: true });

const regexForWrongNames = /\d{4}-\d{2}-\d{2}\s\d{2}\.\d{2}\.\d{2}(-\d)?(\s)?(-)?(\s)?(.+)?\.jpg/;

const filterWrongFileNames = regex => {
  const filterFiles = file => {
    let test = regex.test(file.path);
    test ||
      log(
        `    -  detected wrong file name: ${chalk.yellow(
          path.relative(file.base, file.path)
        )}`
      );
    return test;
  };
  return filter(filterFiles, { dot: true });
};

// const deleteSrcFiles = file => {
//   console.log(file);
//   return Promise.resolve();
// };

const deleteSrcFiles = file => {
  return del(file);
};

const addData = info => {
  return data(function(file) {
    return { test: info };
  });
};

const logData = file => {
  log(file.data);
  // return Promise.resolve();
};

/**
 **************************************************** TASKS
 */
const backupFotos = () =>
  gulp.src(paths.fotosInCu).pipe(gulp.dest(paths.cuTemp));

const fotosToSort = () =>
  gulp
    .src(paths.fotosInCuTemp)
    // .pipe(debug({ title: "    - " }))
    .pipe(markExtFor(".jpeg", "rename"))
    .pipe(renameExt(".jpeg", ".jpg"))
    // .pipe(renameExtTo(".jpg"))
    // .pipe(addData("terefere"))
    .pipe(markExtFor(".JPG", "rename"))
    .pipe(renameExt(".JPG", ".jpg"))
    .pipe(markExtFor(".jpg", "filter"))
    .pipe(filterByExt(".jpg"))
    .pipe(tap(logData))
    .pipe(filterWrongFileNames(regexForWrongNames))
    .pipe(vinylPaths(deleteSrcFiles))
    .pipe(gulp.dest(paths.cuSort));
// .on("end", logIngo);

gulp.task("cleanCuTemp", cleanDir_cuTemp);
gulp.task("cleanCuSort", cleanDir_cuSort);
gulp.task("backupFotos", backupFotos);
gulp.task("fotosToSort", fotosToSort);
gulp.task(
  "default",
  gulp.series(
    gulp.parallel("cleanCuTemp", "cleanCuSort"),
    "backupFotos",
    "fotosToSort"
  )
);
