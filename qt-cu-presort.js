/* eslint-disable no-console */

const gulp = require("gulp");

// FNS:
const paths = require("./fns/load-paths.js")("./paths.json");
const cleanUpDir = require("./fns/cleanup-dir");
const banner = require("./fns/banner");
const filterByExt = require("./fns/filter-by-ext");
const deleteSrcFiles = require("./fns/delete-src-files");
const logFile = require("./fns/log-file");

//TASKS:
const copyJPGs = () => {
  return gulp
    .src(paths.files_cu)
    .pipe(filterByExt(".jpg"))
    .pipe(logFile())
    .pipe(deleteSrcFiles())
    .pipe(gulp.dest(paths.dir_cuTemp_jpgs));
};

const copyJEPGs = () => {
  return gulp
    .src(paths.files_cu)
    .pipe(filterByExt(".jpeg"))
    .pipe(logFile())
    .pipe(deleteSrcFiles())
    .pipe(gulp.dest(paths.dir_cuTemp_jpegs));
};

const copyBIGJPGs = () => {
  return gulp
    .src(paths.files_cu)
    .pipe(filterByExt(".JPG"))
    .pipe(logFile())
    .pipe(deleteSrcFiles())
    .pipe(gulp.dest(paths.dir_cuTemp_bigjpgs));
};

const copyMP4s = () => {
  return gulp
    .src(paths.files_cu)
    .pipe(filterByExt(".mp4"))
    .pipe(logFile())
    .pipe(deleteSrcFiles())
    .pipe(gulp.dest(paths.dir_cuTemp_mp4s));
};

gulp.task("copyJPGs", copyJPGs);
gulp.task("copyJEPGs", copyJEPGs);
gulp.task("copyBIGJPGs", copyBIGJPGs);
gulp.task("copyMP4s", copyMP4s);
gulp.task(
  "default",
  gulp.series("copyJPGs", "copyJEPGs", "copyBIGJPGs", "copyMP4s")
);

// gulp.task("cleanUpCuDir", () => cleanUpDir(paths.files_cu));
// gulp.task("backupCuFotos", backupCuFotos);
// console.log("\n");
// banner("cu-backup", "ANSI Shadow");
