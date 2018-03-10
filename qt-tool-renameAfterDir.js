/* eslint-disable no-console */

const path = require("path");
const meow = require("meow");
const gulp = require("gulp");

// FNS:
const banner = require("./fns/banner");
const deleteSrcFiles = require("./fns/delete-src-files");
const logTask = require("./fns/log-task");
const filterWrongFileNames = require("./fns/filter-wrong-filenames");
const confirmTask = require("./fns/confirm-task");
const countFiles = require("./fns/count-files");
const filterDirs = require("./fns/filter-dirs");
const renameAfterDirName = require("./fns/rename-after-parent-dir");

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
 *  TASK: renameAfterDir
 *************************************************************************/
const cwd = process.cwd();
const dir_fotos = path.normalize(path.resolve(cwd, customPath) + "/");
console.log("dir_fotos ", dir_fotos);

const msg_countFilesBefore = "        Total";
const msg_countFilesToRename = "         - to rename";
const regexForCheckNames = /\d{4}-\d{2}-\d{2}\s\d{2}\.\d{2}\.\d{2}(-\d)?(\s)?(-)?(\s)?(.+)?/;

const renameFn = () => {
  return gulp
    .src(dir_fotos + "**/*")
    .pipe(filterDirs())
    .pipe(countFiles(msg_countFilesBefore))
    .pipe(filterWrongFileNames(regexForCheckNames))
    .pipe(deleteSrcFiles())
    .pipe(countFiles(msg_countFilesToRename))
    .pipe(renameAfterDirName())
    .pipe(gulp.dest(dir_fotos));
};

gulp.task(
  "logDoneRename",
  logTask(`Renamed photo after paretn dir name in: '${dir_fotos}' dir.`, {
    task: "done",
    color: "green"
  })
);

gulp.task("renameFn", renameFn);

gulp.task("renameAfterDir", gulp.series("renameFn", "logDoneRename"));

/*************************************************************************
 *  DEFAULT
 *************************************************************************/
gulp.task("displayBanner", () => banner("Normalize Names", "ANSI Shadow"));
gulp.task("confirmRun", confirmTask("Do you want to run this task?"));

gulp.task(
  "default",
  gulp.series("displayBanner", "confirmRun", "renameAfterDir")
);
