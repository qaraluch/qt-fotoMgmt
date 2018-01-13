/* eslint-disable no-console */

const gulp = require("gulp");
const path = require("path");
const chalk = require("chalk");

const debug = require("gulp-debug");
// [sindresorhus/gulp-debug: ](https://github.com/sindresorhus/gulp-debug)
// npm i gulp-debug -D

const log = require("fancy-log");
// [js-cli/fancy-log: Log things, prefixed with a timestamp](https://github.com/js-cli/fancy-log)
// npm i fancy-log -S

const zip = require("gulp-zip");
// [sindresorhus/gulp-zip: ZIP compress files](https://github.com/sindresorhus/gulp-zip)
// npm i gulp-zip -S

// FNS:
const paths = require("./fns/load-paths.js")("./paths.json");
const cleanUpDir = require("./fns/cleanup-dir");
const timeStamp = require("./fns/time-stamp");
const banner = require("./fns/banner");

//TASKS:
const backupCuFotos = () => {
  console.log("\n");
  banner("cu-backup", "ANSI Shadow");
  return gulp
    .src(paths.files_cu)
    .pipe(debug({ title: "  - " }))
    .pipe(zip(`cu-temp-arch-${timeStamp()}.zip`))
    .pipe(debug({ title: "  - " }))
    .pipe(gulp.dest(paths.dir_cuBackup));
};
gulp.task("cleanupCuBack", () => cleanUpDir(paths.dir_cuBackup));

gulp.task("backupCuFotos", backupCuFotos);

gulp.task("default", gulp.series("backupCuFotos"));