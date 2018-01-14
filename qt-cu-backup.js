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
gulp.task("cleanupBackup", () => cleanUpDir(dir_cuBackup));

gulp.task("backupCuFotos", backupCuFotos);
gulp.task("displayBanner", () => banner("cu-backup", "ANSI Shadow"));

gulp.task("default", gulp.series("displayBanner", "backupCuFotos"));
