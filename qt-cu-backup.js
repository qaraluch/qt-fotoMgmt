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

// FNS:
const paths = require("./fns/load-paths.js")("./paths.json");
const cleanUpDir = require("./fns/cleanup-dir");

//TASKS:
const backupCuFotos = () =>
  gulp
    .src(paths.files_cu)
    .pipe(debug({ title: "          - " }))
    .pipe(gulp.dest(paths.dir_cuBackup));

gulp.task("cleanUpCuDir", () => cleanUpDir(paths.files_cu));

gulp.task("backupCuFotos", backupCuFotos);

gulp.task(
  "default",
  gulp.series(
    "backupCuFotos"
    // "cleanUpDir" // add in prod. ()
  )
);
