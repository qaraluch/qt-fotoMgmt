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
const renameExt = require("./fns/rename-ext");
const filterWrongFileNames = require("./fns/filter-wrong-filenames");
const renameAfterExifDate = require("./fns/rename-after-exif-date")(); //lazypipe
const normalizePhotoNames = require("./fns/normalize-photo-names");

const displayBanner = () => {
  console.log("\n");
  banner("cu-presort", "ANSI Shadow");
  return Promise.resolve();
};

/********************************
 *  PATHS
 ********************************/

// TASK: firstSort
const dir_cu = paths.cu;
const dir_cuTempJPGs = paths.cuTemp + "jpgs/";
const dir_cuTempJPEGs = paths.cuTemp + "jpegs/";
const dir_cuTempBigJPGs = paths.cuTemp + "bigJPGs/";
const dir_cuTempMP4s = paths.cuTemp + "mp4s/";

// TASK: renameExtensions
const dir_cuTempFlushJPGs = paths.cuTemp + "flushJPGs/";

// TASK: renameWrongNames
const dir_cuTempGoodJPGs = paths.cuTemp + "goodJPGs/";
const dir_cuTempJPGRenamed = paths.cuTemp + "jpgRenamed/";

// TASK: normalizeNames
const dir_cuTempNormalizedNames = paths.cuTemp + "normalizedNames/";

// TASK: moveToCuSort
const dir_cuSort = paths.cuSort;
const dir_cuSortFilmiki = paths.cuSort + "filmiki-2017/";

const dir_cuTemp = paths.cuTemp;

/*************************************************************************
 *  TASK: firstSort
 *************************************************************************/

const copyJPGs = () => {
  return gulp
    .src(dir_cu + "**/*")
    .pipe(filterByExt(".jpg"))
    .pipe(logFile())
    .pipe(deleteSrcFiles())
    .pipe(gulp.dest(dir_cuTempJPGs));
};

const copyJEPGs = () =>
  gulp
    .src(dir_cu + "**/*")
    .pipe(filterByExt(".jpeg"))
    .pipe(logFile())
    .pipe(deleteSrcFiles())
    .pipe(gulp.dest(dir_cuTempJPEGs));

const copyBIGJPGs = () =>
  gulp
    .src(dir_cu + "**/*")
    .pipe(filterByExt(".JPG"))
    .pipe(logFile())
    .pipe(deleteSrcFiles())
    .pipe(gulp.dest(dir_cuTempBigJPGs));

const copyMP4s = () =>
  gulp
    .src(dir_cu + "**/*")
    .pipe(filterByExt(".mp4"))
    .pipe(logFile())
    .pipe(deleteSrcFiles())
    .pipe(gulp.dest(dir_cuTempMP4s));

const msg_leftInCu =
  "If some files left in CU dir: means that some edgecases is not supported!";

const seeWhatLeft = () =>
  gulp
    .src(dir_cu + "**/*")
    .pipe(logMsg(msg_leftInCu, { task: "warn", color: "yellow" }))
    .pipe(logFile());

gulp.task("copyJPGs", copyJPGs);
gulp.task("copyJEPGs", copyJEPGs);
gulp.task("copyBIGJPGs", copyBIGJPGs);
gulp.task("copyMP4s", copyMP4s);
gulp.task("seeWhatLeft", seeWhatLeft);
gulp.task(
  "firstSort",
  gulp.series("copyJPGs", "copyJEPGs", "copyBIGJPGs", "copyMP4s", "seeWhatLeft")
);

/*************************************************************************
 *  TASK: renameExtensions
 *************************************************************************/
const renameBIGJPGs = () =>
  gulp
    .src(dir_cuTempBigJPGs + "**/*")
    .pipe(renameExt(".JPG", ".jpg"))
    .pipe(gulp.dest(dir_cuTempFlushJPGs));

const renameJPEGs = () =>
  gulp
    .src(dir_cuTempJPEGs + "**/*")
    .pipe(renameExt(".jpeg", ".jpg"))
    .pipe(gulp.dest(dir_cuTempFlushJPGs));

const moveJPGs = () =>
  gulp.src(dir_cuTempJPGs + "**/*").pipe(gulp.dest(dir_cuTempFlushJPGs));

gulp.task("renameBIGJPGs", renameBIGJPGs);
gulp.task("cleanupBIGJPGs", () => cleanUpDir(dir_cuTempBigJPGs));
gulp.task("renameJPEGs", renameJPEGs);
gulp.task("cleanupJPEGs", () => cleanUpDir(dir_cuTempJPEGs));
gulp.task("moveJPGs", moveJPGs);
gulp.task("cleanupJPGs", () => cleanUpDir(dir_cuTempJPGs));
gulp.task(
  "renameExtensions",
  gulp.series(
    gulp.parallel("renameBIGJPGs", "renameJPEGs", "moveJPGs"),
    gulp.parallel("cleanupBIGJPGs", "cleanupJPEGs", "cleanupJPGs")
  )
);

/*************************************************************************
 *  TASK: renameWrongNames
 *************************************************************************/
const regexForCheckNames = /\d{4}-\d{2}-\d{2}\s\d{2}\.\d{2}\.\d{2}(-\d)?(\s)?(-)?(\s)?(.+)?\.jpg/;

const checkNames = () =>
  gulp
    .src(dir_cuTempFlushJPGs + "**/*")
    .pipe(filterWrongFileNames(regexForCheckNames))
    .pipe(deleteSrcFiles())
    .pipe(gulp.dest(dir_cuTempGoodJPGs));

const msg_tryToRename = "Try to rename files in jpgFlush dir after exif date!";

const tryToRenameWrongAfterExifDate = () =>
  gulp
    .src(dir_cuTempFlushJPGs + "**/*")
    .pipe(logFile())
    .pipe(logMsg(msg_tryToRename, { task: "warn" }))
    .pipe(deleteSrcFiles()) // logic flaw!!!!!
    .pipe(renameAfterExifDate())
    .pipe(gulp.dest(dir_cuTempJPGRenamed));

const msg_leftInJpgFlush =
  "If some files left in jpgFlush dir: means not all wrong named files was renamed!";

const seeWhatLeftInJpgFlush = () =>
  gulp
    .src(dir_cuTempFlushJPGs + "**/*")
    .pipe(logMsg(msg_leftInJpgFlush, { task: "warn", color: "yellow" }))
    .pipe(logFile());

const msg_moveAllToGood = "Moving all renamed files to goodJPGs dir.";

const flushAllToGood = () => {
  return gulp
    .src(dir_cuTempJPGRenamed + "**/*")
    .pipe(logMsg(msg_moveAllToGood, { color: "reset" }))
    .pipe(logFile())
    .pipe(gulp.dest(dir_cuTempGoodJPGs));
};

gulp.task("checkNames", checkNames);
gulp.task("tryToRenameWrongAfterExifDate", tryToRenameWrongAfterExifDate);
gulp.task("seeWhatLeftInJpgFlush", seeWhatLeftInJpgFlush);
gulp.task("flushAllToGood", flushAllToGood);
gulp.task("cleanupJpgRenamed", () => cleanUpDir(dir_cuTempJPGRenamed));
gulp.task(
  "renameWrongNames",
  gulp.series(
    "checkNames",
    "tryToRenameWrongAfterExifDate",
    "seeWhatLeftInJpgFlush",
    "flushAllToGood",
    "cleanupJpgRenamed"
    // jpgFlush will remain due to some files may not be renamed
  )
);

/*************************************************************************
 *  TASK: normalizeNames
 *************************************************************************/
const normalizeJPGNames = () => {
  return gulp
    .src(dir_cuTempGoodJPGs + "**/*")
    .pipe(logFile())
    .pipe(normalizePhotoNames())
    .pipe(gulp.dest(dir_cuTempNormalizedNames));
};

gulp.task("normalizeJPGNames", normalizeJPGNames);
gulp.task("cleanupGoodJPGs", () => cleanUpDir(dir_cuTempGoodJPGs));

gulp.task(
  "normalizeNames",
  gulp.series("normalizeJPGNames", "cleanupGoodJPGs")
);

/*************************************************************************
 *  TASK: moveToCuSort
 *************************************************************************/
const movePhotosToCuSort = () => {
  return gulp
    .src(dir_cuTempNormalizedNames + "**/*")
    .pipe(logFile())
    .pipe(gulp.dest(dir_cuSort));
};

const moveMP4sToCuSort = () =>
  gulp
    .src(dir_cuTempMP4s + "**/*")
    .pipe(logFile())
    .pipe(gulp.dest(dir_cuSortFilmiki));

gulp.task("movePhotosToCuSort", movePhotosToCuSort);
gulp.task("moveMP4sToCuSort", moveMP4sToCuSort);
gulp.task("cleanupNormalizedNames", () =>
  cleanUpDir(dir_cuTempNormalizedNames)
);
gulp.task("cleanupMp4s", () => cleanUpDir(dir_cuTempMP4s));
gulp.task(
  "moveToCuSort",
  gulp.series(
    "movePhotosToCuSort",
    "moveMP4sToCuSort",
    gulp.parallel("cleanupNormalizedNames", "cleanupMp4s")
  )
);

/*************************************************************************
 *  DEFAULT
 *************************************************************************/
gulp.task("displayBanner", displayBanner);

gulp.task(
  "default",
  gulp.series(
    "displayBanner",
    "firstSort",
    "renameExtensions",
    "renameWrongNames",
    "normalizeNames",
    "moveToCuSort"
  )
);

gulp.task("cleanup", () => cleanUpDir(dir_cuTemp));
