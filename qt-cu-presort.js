/* eslint-disable no-console */

const gulp = require("gulp");

const log = require("fancy-log");
// [js-cli/fancy-log: Log things, prefixed with a timestamp](https://github.com/js-cli/fancy-log)
// npm i fancy-log -S

// FNS:
const paths = require("./fns/load-paths.js")("./paths.json");
const cleanUpDir = require("./fns/cleanup-dir");
const banner = require("./fns/banner");
const filterByExt = require("./fns/filter-by-ext");
const deleteSrcFiles = require("./fns/delete-src-files");
const logFile = require("./fns/log-file");
const logMsg = require("./fns/log-msg");

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

const seeWahtLeftInCu = () => {
  return gulp
    .src(paths.files_cu)
    .pipe(
      logMsg(
        "If some files left in CU dir means that some edgecases is not supported!",
        { task: "warn", color: "reset" }
      )
    )
    .pipe(logFile());
};

gulp.task("copyJPGs", copyJPGs);
gulp.task("copyJEPGs", copyJEPGs);
gulp.task("copyBIGJPGs", copyBIGJPGs);
gulp.task("copyMP4s", copyMP4s);
gulp.task("seeWahtLeftInCu", seeWahtLeftInCu);
gulp.task(
  "default",
  gulp.series(
    "copyJPGs",
    "copyJEPGs",
    "copyBIGJPGs",
    "copyMP4s",
    "seeWahtLeftInCu"
  )
);

// gulp.task("cleanUpCuDir", () => cleanUpDir(paths.files_cu));
// gulp.task("backupCuFotos", backupCuFotos);
// console.log("\n");
// banner("cu-backup", "ANSI Shadow");
