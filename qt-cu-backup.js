/* eslint-disable no-console */

const gulp = require("gulp");

const debug = require("gulp-debug");
// [sindresorhus/gulp-debug: ](https://github.com/sindresorhus/gulp-debug)
// npm i gulp-debug -D

const zip = require("gulp-zip");
// [sindresorhus/gulp-zip: ZIP compress files](https://github.com/sindresorhus/gulp-zip)
// npm i gulp-zip -S

// FNS:
const paths = require("./fns/load-paths.js")("./paths.json");
const cleanUpDir = require("./fns/cleanup-dir");
const timeStamp = require("./fns/time-stamp");
const banner = require("./fns/banner");
const confirmTask = require("./fns/confirm-task");

/********************************
 *  PATHS
 ********************************/
const dir_cu = paths.cu;
const dir_cuBackup = paths.cuBackup;

//TASKS:
const backupCuFotos = () => {
  return gulp
    .src(dir_cu + "**/*")
    .pipe(debug({ title: "  - " }))
    .pipe(zip(`cu-temp-arch-${timeStamp()}.zip`))
    .pipe(debug({ title: "  - " }))
    .pipe(gulp.dest(dir_cuBackup));
};

gulp.task("backupCuFotos", backupCuFotos);

gulp.task("confirmRun", confirmTask("Do you want to run this task?"));
gulp.task(
  "confirmRemoveBackups",
  confirmTask("Do you want to remove all cu backup files (.zips)?")
);
gulp.task("displayBanner", () => banner("cu-backup", "ANSI Shadow"));
gulp.task("cleanUpBackups", () => cleanUpDir(dir_cuBackup));

gulp.task(
  "default",
  gulp.series("displayBanner", "confirmRun", "backupCuFotos")
);

gulp.task(
  "removeBackups",
  gulp.series("confirmRemoveBackups", "cleanUpBackups")
);
