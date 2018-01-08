/* eslint-disable no-console */

const gulp = require("gulp");
const path = require("path");
const chalk = require("chalk");

const rename = require("gulp-rename");
// [hparra/gulp-rename: Rename files easily](https://github.com/hparra/gulp-rename)
// npm i gulp-rename -S

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

const del = require("del");
// https://github.com/sindresorhus/del
// npm i del -S

const paths = require("./fns/load-paths.js")("./paths.json");

const cleanUpDir = require("./fns/cleanup-dir");

gulp.task("cleanCuTemp", () => cleanUpDir(paths.cuTemp));
gulp.task("cleanCuSort", () => cleanUpDir(paths.cuSort));
gulp.task("backupFotos", () => {});
gulp.task("fotosToSort", () => {});
gulp.task(
  "default",
  gulp.series(
    gulp.parallel("cleanCuTemp", "cleanCuSort"),
    "backupFotos",
    "fotosToSort"
  )
);

gulp.task("cleanAll", gulp.parallel("cleanCuTemp", "cleanCuSort"));
