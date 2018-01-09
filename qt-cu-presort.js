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
const banner = require("./fns/banner");
const filterByExt = require("./fns/filter-by-ext");
const deleteSrcFiles = require("./fns/delete-src-files");

//TASKS:
const copyJPGs = () => {
  return gulp
    .src(paths.files_cu)
    .pipe(filterByExt(".jpg"))
    .pipe(debug({ title: "  - " }))
    .pipe(deleteSrcFiles())
    .pipe(gulp.dest(paths.dir_cuTemp_jpgs));
};

const copyJEPGs = () => {
  return gulp
    .src(paths.files_cu)
    .pipe(filterByExt(".jpeg"))
    .pipe(debug({ title: "  - " }))
    .pipe(deleteSrcFiles())
    .pipe(gulp.dest(paths.dir_cuTemp_jpegs));
};

const copyBIGJPGs = () => {
  return gulp
    .src(paths.files_cu)
    .pipe(filterByExt(".JPG"))
    .pipe(debug({ title: "  - " }))
    .pipe(deleteSrcFiles())
    .pipe(gulp.dest(paths.dir_cuTemp_bigjpgs));
};

gulp.task("copyJPGs", copyJPGs);
gulp.task("copyJEPGs", copyJEPGs);
gulp.task("copyBIGJPGs", copyBIGJPGs);
gulp.task("default", gulp.series("copyJPGs", "copyJEPGs", "copyBIGJPGs"));

// gulp.task("cleanUpCuDir", () => cleanUpDir(paths.files_cu));
// gulp.task("backupCuFotos", backupCuFotos);
// console.log("\n");
// banner("cu-backup", "ANSI Shadow");
