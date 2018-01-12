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

//TASKS:
const copyJPGs = () => {
  console.log("\n");
  banner("cu-presort", "ANSI Shadow");
  return gulp
    .src(paths.files_cu)
    .pipe(filterByExt(".jpg"))
    .pipe(logFile())
    .pipe(deleteSrcFiles())
    .pipe(gulp.dest(paths.dir_cuTemp_jpgs));
};

const copyJEPGs = () =>
  gulp
    .src(paths.files_cu)
    .pipe(filterByExt(".jpeg"))
    .pipe(logFile())
    .pipe(deleteSrcFiles())
    .pipe(gulp.dest(paths.dir_cuTemp_jpegs));

const copyBIGJPGs = () =>
  gulp
    .src(paths.files_cu)
    .pipe(filterByExt(".JPG"))
    .pipe(logFile())
    .pipe(deleteSrcFiles())
    .pipe(gulp.dest(paths.dir_cuTemp_bigjpgs));

const copyMP4s = () =>
  gulp
    .src(paths.files_cu)
    .pipe(filterByExt(".mp4"))
    .pipe(logFile())
    .pipe(deleteSrcFiles())
    .pipe(gulp.dest(paths.dir_cuTemp_mp4s));

const msg_leftInCu =
  "If some files left in CU dir: means that some edgecases is not supported!";

const seeWhatLeft = () =>
  gulp
    .src(paths.files_cu)
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

const renameBIGJPGs = () =>
  gulp
    .src(paths.files_cuTemp_bigjpgs)
    .pipe(renameExt(".JPG", ".jpg"))
    .pipe(gulp.dest(paths.dir_cuTemp_jpgFlush));

const renameJPEGs = () =>
  gulp
    .src(paths.files_cuTemp_jpegs)
    .pipe(renameExt(".jpeg", ".jpg"))
    .pipe(gulp.dest(paths.dir_cuTemp_jpgFlush));

const moveJPGs = () =>
  gulp.src(paths.files_cuTemp_jpgs).pipe(gulp.dest(paths.dir_cuTemp_jpgFlush));

gulp.task("renameBIGJPGs", renameBIGJPGs);
gulp.task("cleanupBIGJPGs", () => cleanUpDir(paths.dir_cuTemp_bigjpgs));
gulp.task("renameJPEGs", renameJPEGs);
gulp.task("cleanupJPEGs", () => cleanUpDir(paths.dir_cuTemp_jpegs));
gulp.task("moveJPGs", moveJPGs);
gulp.task("cleanupJPGs", () => cleanUpDir(paths.dir_cuTemp_jpgs));
gulp.task(
  "renameExtensions",
  gulp.series(
    gulp.parallel("renameBIGJPGs", "renameJPEGs", "moveJPGs"),
    gulp.parallel("cleanupBIGJPGs", "cleanupJPEGs", "cleanupJPGs")
  )
);

const regexForCheckNames = /\d{4}-\d{2}-\d{2}\s\d{2}\.\d{2}\.\d{2}(-\d)?(\s)?(-)?(\s)?(.+)?\.jpg/;

const checkNames = () =>
  gulp
    .src(paths.files_cuTemp_jpgFlush)
    .pipe(filterWrongFileNames(regexForCheckNames))
    .pipe(deleteSrcFiles())
    .pipe(gulp.dest(paths.dir_cuTemp_goodJPGs));

const msg_tryToRename = "Try to rename files in jpgFlush dir after exif date!";

const tryToRenameWrongAfterExifDate = () =>
  gulp
    .src(paths.files_cuTemp_jpgFlush)
    .pipe(logFile())
    .pipe(logMsg(msg_tryToRename, { task: "warn" }))
    .pipe(deleteSrcFiles())
    .pipe(renameAfterExifDate())
    .pipe(gulp.dest(paths.dir_cuTemp_jpgRenamed));

const msg_leftInJpgFlush =
  "If some files left in jpgFlush dir: means not all wrong named files was renamed!";

const seeWhatLeftInJpgFlush = () =>
  gulp
    .src(paths.files_cuTemp_jpgFlush)
    .pipe(logMsg(msg_leftInJpgFlush, { task: "warn", color: "yellow" }))
    .pipe(logFile());

const msg_moveAllToGood = "Movin all renamed files to goodJPGs dir.";

const flushAllToGood = () => {
  return gulp
    .src(paths.files_cuTemp_jpgRenames)
    .pipe(logMsg(msg_moveAllToGood, { color: "reset" }))
    .pipe(logFile())
    .pipe(gulp.dest(paths.dir_cuTemp_goodJPGs));
};

gulp.task("checkNames", checkNames);
gulp.task("tryToRenameWrongAfterExifDate", tryToRenameWrongAfterExifDate);
gulp.task("seeWhatLeftInJpgFlush", seeWhatLeftInJpgFlush);
gulp.task("flushAllToGood", flushAllToGood);
gulp.task("cleanupJpgRenamed", () => cleanUpDir(paths.dir_cuTemp_jpgRenamed));
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

const normalizeJPGNames = () => {
  return gulp
    .src(paths.files_cuTemp_goodJPGs)
    .pipe(logFile())
    .pipe(normalizePhotoNames())
    .pipe(gulp.dest(paths.dir_cuTemp_normalizedNames));
};

gulp.task("normalizeJPGNames", normalizeJPGNames);
gulp.task("cleanupGoodJPGs", () => cleanUpDir(paths.dir_cuTemp_goodJPGs));

gulp.task(
  "normalizeNames",
  gulp.series("normalizeJPGNames", "cleanupGoodJPGs")
);

// gulp.task("default", gulp.series("flushAllToGood", "cleanupJpgRenamed")); //for dev
gulp.task(
  "default",
  gulp.series(
    "firstSort",
    "renameExtensions",
    "renameWrongNames",
    "normalizeNames"
  )
);
