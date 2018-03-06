/* eslint-disable no-console */

const gulp = require("gulp");

const prompt = require("gulp-prompt");
//[Freyskeyd/gulp-prompt: Add interactive console prompts to gulp](https://github.com/Freyskeyd/gulp-prompt)
// npm i gulp-prompt -S

const debug = require("gulp-debug");
// [sindresorhus/gulp-debug: ](https://github.com/sindresorhus/gulp-debug)
// npm i gulp-debug -D

const zip = require("gulp-zip");
// [sindresorhus/gulp-zip: ZIP compress files](https://github.com/sindresorhus/gulp-zip)
// npm i gulp-zip -S


const path = require("path");

// FNS:
// const paths = require("./fns/load-paths.js")("./paths.json", "QT_FOTOMGMT");
// Different paths are loaded. It is based on env variable: $QT_FOTOMGMT (dev/prod).
const cleanUpDir = require("./fns/cleanup-dir");
const banner = require("./fns/banner");
const filterByExt = require("./fns/filter-by-ext");
const deleteSrcFiles = require("./fns/delete-src-files");
const logFile = require("./fns/log-file");
const logMsg = require("./fns/log-msg");
const logTask = require("./fns/log-task");
const renameExt = require("./fns/rename-ext");
const filterWrongFileNames = require("./fns/filter-wrong-filenames");
const renameAfterExifDate = require("./fns/rename-after-exif-date")(); //lazypipe
const normalizePhotoNames = require("./fns/normalize-photo-names");
const confirmTask = require("./fns/confirm-task");
const bumpFotoVersion = require("./fns/bump-foto-version");
const countFiles = require("./fns/count-files");
const tester = require("./fns/tester");
const testerReport = require("./fns/tester-report-presort");
const timeStamp = require("./fns/time-stamp");

/********************************
 *  TESTER
 ********************************/
// const presortTester = tester();

// const spawnTesterCb = propertyName => count =>
//   presortTester.add(propertyName, count);

// gulp.task("testing", () => {
//   presortTester.show(testerReport);
//   return Promise.resolve();
// });

// gulp.task(
//   "logDoneTesting",
//   logTask("Tested results of the task!", {
//     task: "done",
//     color: "green"
//   })
// );

// gulp.task("testIt", gulp.series("testing", "logDoneTesting"));

/********************************
 *  PATHS
 ********************************/
// TASK: firstSort
// const dir_cu = paths.cu;

// const dir_cuTempCopyCu = paths.cuTemp + "cuCopy/";
// const dir_cuTempJPGs = paths.cuTemp + "jpgs/";
// const dir_cuTempJPEGs = paths.cuTemp + "jpegs/";
// const dir_cuTempBigJPGs = paths.cuTemp + "bigJPGs/";
// const dir_cuTempMP4s = paths.cuTemp + "mp4s/";
// const dir_cuTempGIFs = paths.cuTemp + "gifs/";

// // TASK: renameExtensions
// const dir_cuTempFlushJPGs = paths.cuTemp + "flushJPGs/";

// // TASK: renameWrongNames
// const dir_cuTempGoodJPGs = paths.cuTemp + "goodJPGs/";
// const dir_cuTempJPGRenamed = paths.cuTemp + "jpgRenamed/";

// // TASK: normalizeNames
// const dir_cuTempNormalizedNames = paths.cuTemp + "normalizedNames/";

// // TASK: moveToCuSort
// const dir_cuSort = paths.cuSort;

// const dir_cuTemp = paths.cuTemp;

const dir_fotos = "./.fotos/cuSort2/praca - sth/";
const dir_backup = `${dir_fotos}.backups/`;

//TASK: ???
const msg_forLogFile = "      - ";
const msg_countFiles = "        Total";

const cwd = process.cwd();

const testTask = () => {
  return gulp
    .src(dir_fotos + "**/*")
    .pipe(logMsg("Copy files:", { color: "reset" }))
    .pipe(debug({ title: "  - " }))
    .pipe(logFile(msg_forLogFile))
    .pipe(countFiles(msg_countFiles));

};

gulp.task(
  "logDoneBackup",
  logTask("Made ....", {
    task: "done",
    color: "green"
  })
);

gulp.task("testTask", testTask);

/*************************************************************************
 *  TASK: normalizeNames
 *************************************************************************/
// const normalizeJPGNames = () => {
//   return gulp
//     .src(dir_cuTempGoodJPGs + "**/*")
//     .pipe(normalizePhotoNames())
//     .pipe(countFiles(msg_countFiles))
//     .pipe(gulp.dest(dir_cuTempNormalizedNames));
// };

// gulp.task(
//   "logDoneNormalizeNames",
//   logTask("Normalized photo names.", {
//     task: "done",
//     color: "green"
//   })
// );

// gulp.task("normalizeJPGNames", normalizeJPGNames);
// gulp.task("cleanupGoodJPGs", () => cleanUpDir(dir_cuTempGoodJPGs));

// gulp.task(
//   "normalizeNames",
//   gulp.series("normalizeJPGNames", "cleanupGoodJPGs", "logDoneNormalizeNames")
// );

/*************************************************************************
 *  DEFAULT
 *************************************************************************/
gulp.task("displayBanner", () => banner("Normalize Names", "ANSI Shadow"));
gulp.task("confirmRun", confirmTask("Do you want to run this task?"));

gulp.task(
  "default",
  gulp.series(
    "displayBanner",
    "confirmRun",
    "testTask"
    // "cuCopy",
    // "firstSort",
    // "renameExtensions",
    // "renameWrongNames",
    // "normalizeNames",
    // "moveToCuSort",
    // "testIt",
    // "confirmCleanUp",
    // "cleanup",
    // "logDoneCleanup"
  )
);
