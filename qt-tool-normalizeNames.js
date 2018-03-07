/* eslint-disable no-console */

const path = require("path");
const meow = require("meow");
const gulp = require("gulp");

const debug = require("gulp-debug");
// [sindresorhus/gulp-debug: ](https://github.com/sindresorhus/gulp-debug)
// npm i gulp-debug -D

// FNS:
const banner = require("./fns/banner");
const deleteSrcFiles = require("./fns/delete-src-files");
const logTask = require("./fns/log-task");
const filterWrongFileNames = require("./fns/filter-wrong-filenames");
const normalizePhotoNames = require("./fns/normalize-photo-names");
const confirmTask = require("./fns/confirm-task");
const countFiles = require("./fns/count-files");
const filterDirs = require("./fns/filter-dirs");

/********************************
 *  ADDITIONAL CLI ARGS
 ********************************/
const options = {
  flags: {
    path: {
      type: "string",
      alias: "p",
      default: process.cwd()
    }
  }
};

const args = meow(" ", options);
const { path: customPath } = args.flags;

/*************************************************************************
 *  TASK: normalizeNames
 *************************************************************************/
const cwd = process.cwd();
const dir_fotos = path.normalize(path.resolve(cwd, customPath) + "/");

const msg_countFilesBefore = "        Total";
const msg_countFilesToRename = "         - to rename";
const regexForCheckNames = /\d{4}-\d{2}-\d{2}\s\d{2}\.\d{2}\.\d{2}(-\d)?(\s)?(-)?(\s)?(.+)?/;

const normalizeJPGNames = () => {
  return gulp
    .src(dir_fotos + "**/*")
    .pipe(filterDirs())
    .pipe(countFiles(msg_countFilesBefore))
    .pipe(filterWrongFileNames(regexForCheckNames))
    .pipe(deleteSrcFiles())
    .pipe(countFiles(msg_countFilesToRename))
    .pipe(normalizePhotoNames())
    .pipe(gulp.dest(dir_fotos));
};

gulp.task(
  "logDoneNormalizeNames",
  logTask(`Normalized photo names in: '${dir_fotos}' dir.`, {
    task: "done",
    color: "green"
  })
);

gulp.task("normalizeJPGNames", normalizeJPGNames);

gulp.task(
  "normalizeNames",
  gulp.series("normalizeJPGNames", "logDoneNormalizeNames")
);

/*************************************************************************
 *  DEFAULT
 *************************************************************************/
gulp.task("displayBanner", () => banner("Normalize Names", "ANSI Shadow"));
gulp.task("confirmRun", confirmTask("Do you want to run this task?"));

gulp.task(
  "default",
  gulp.series("displayBanner", "confirmRun", "normalizeNames")
);
