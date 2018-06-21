/* eslint-disable no-console */

const gulp = require("gulp");

const debug = require("gulp-debug");
// [sindresorhus/gulp-debug: ](https://github.com/sindresorhus/gulp-debug)
// npm i gulp-debug -D

const zip = require("gulp-zip");
// [sindresorhus/gulp-zip: ZIP compress files](https://github.com/sindresorhus/gulp-zip)
// npm i gulp-zip -S

// FNS:
const paths = require("./fns/load-paths.js")("./paths.json", "QT_FOTOMGMT");
const cleanUpDir = require("./fns/cleanup-dir");
const timeStamp = require("./fns/time-stamp");
const banner = require("./fns/banner");
const { confirmTask } = require("./fns/confirm-task");
const logTask = require("./fns/log-task");
const logFile = require("./fns/log-file");
const logMsg = require("./fns/log-msg");
const countFiles = require("./fns/count-files");

const msg_countFiles = "        Total";
const msg_forLogFile = "      - ";
const msg_forLogFileZip = "to zip: ";

/********************************
 *  PATHS
 ********************************/
const dir_cu = paths.cu;
const dir_cuBackup = paths.cuBackup;

//TASKS:
const backupCuFotos = () => {
  return (
    gulp
      .src(dir_cu + "**/*")
      .pipe(logMsg("Copy files:", { color: "reset" }))
      // .pipe(debug({ title: "  - " }))
      .pipe(logFile(msg_forLogFile))
      .pipe(countFiles(msg_countFiles))
      .pipe(zip(`cu-temp-arch-${timeStamp()}.zip`))
      // .pipe(debug({ title: "  - " }))
      .pipe(logFile(msg_forLogFileZip))
      .pipe(gulp.dest(dir_cuBackup))
  );
};

gulp.task(
  "logDoneBackup",
  logTask("Made backup of CU photos.", {
    task: "done",
    color: "green"
  })
);

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
  gulp.series("displayBanner", "confirmRun", "backupCuFotos", "logDoneBackup")
);

gulp.task(
  "logDoneRemoveBackups",
  logTask("Removed all temp CU photos backups!", {
    task: "done",
    color: "green"
  })
);

gulp.task(
  "removeBackups",
  gulp.series("confirmRemoveBackups", "cleanUpBackups", "logDoneRemoveBackups")
);
