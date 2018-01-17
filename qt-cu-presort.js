/* eslint-disable no-console */

const gulp = require("gulp");

const prompt = require("gulp-prompt");
//[Freyskeyd/gulp-prompt: Add interactive console prompts to gulp](https://github.com/Freyskeyd/gulp-prompt)
// npm i gulp-prompt -S

// FNS:
const paths = require("./fns/load-paths.js")("./paths.json", "QT_FOTOMGMT");
// Different paths are loaded. It is based on env variable: $QT_FOTOMGMT (dev/prod).
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
const confirmTask = require("./fns/confirm-task");
const bumpFotoVersion = require("./fns/bump-foto-version");
const countFiles = require("./fns/count-files");

/********************************
 *  PATHS
 ********************************/

// TASK: firstSort
const dir_cu = paths.cu;

const dir_cuTempCopyCu = paths.cuTemp + "cuCopy/";
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

const dir_cuTemp = paths.cuTemp;

/*************************************************************************
 *  TASK: copyCu
 *************************************************************************/
const msg_copyCu = "Moved fotos from cu dir";
const makeCuCopy = () =>
  gulp
    .src(dir_cu + "**/*")
    .pipe(logFile())
    .pipe(deleteSrcFiles())
    .pipe(countFiles(msg_copyCu))
    .pipe(gulp.dest(dir_cuTempCopyCu));

gulp.task("makeCuCopy", makeCuCopy);

/*************************************************************************
 *  TASK: firstSort
 *************************************************************************/
const msg_jpgs = "Moved jpgs";
const msg_jpegs = "Moved jpegs";
const msg_bigJPGs = "Moved JPGs";
const msg_mp4s = "Moved mp4s";
const msg_left = "Left files";

const copyJPGs = () => {
  return gulp
    .src(dir_cuTempCopyCu + "**/*")
    .pipe(filterByExt(".jpg"))
    .pipe(logFile())
    .pipe(deleteSrcFiles())
    .pipe(countFiles(msg_jpgs))
    .pipe(gulp.dest(dir_cuTempJPGs));
};

const copyJEPGs = () =>
  gulp
    .src(dir_cuTempCopyCu + "**/*")
    .pipe(filterByExt(".jpeg"))
    .pipe(logFile())
    .pipe(deleteSrcFiles())
    .pipe(countFiles(msg_jpegs))
    .pipe(gulp.dest(dir_cuTempJPEGs));

const copyBIGJPGs = () =>
  gulp
    .src(dir_cuTempCopyCu + "**/*")
    .pipe(filterByExt(".JPG"))
    .pipe(logFile())
    .pipe(deleteSrcFiles())
    .pipe(countFiles(msg_bigJPGs))
    .pipe(gulp.dest(dir_cuTempBigJPGs));

const copyMP4s = () =>
  gulp
    .src(dir_cuTempCopyCu + "**/*")
    .pipe(filterByExt(".mp4"))
    .pipe(logFile())
    .pipe(deleteSrcFiles())
    .pipe(countFiles(msg_mp4s))
    .pipe(gulp.dest(dir_cuTempMP4s));

const msg_leftInCu =
  "If some files left in cuCopy dir: means that some edgecases is not supported!?";

const seeWhatLeft = () =>
  gulp
    .src(dir_cuTempCopyCu + "**/*")
    .pipe(logMsg(msg_leftInCu, { task: "warn", color: "yellow" }))
    .pipe(logFile())
    .pipe(countFiles(msg_left));
//TODO: add custom logs files;

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
    .pipe(bumpFotoVersion(1))
    // bump ver to avoid overwriting modified fotos
    // 1 due to jpegs are modified ones so must have next version
    .pipe(logFile())
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
    .pipe(renameAfterExifDate())
    .pipe(gulp.dest(dir_cuTempJPGRenamed));

const msg_askIfRenamedPropertly = "All files renamed correctly?";
const msg_continue = "Continue task run?";
const msg_warnRemainFiles =
  "All wrong files will remain in flushJPGs (for manual renaming)";
const msg_moveAllToGood = "Moving all renamed files to goodJPGs dir...";

const flushAllToGood = () => {
  return gulp
    .src(dir_cuTempJPGRenamed + "**/*")
    .pipe(logMsg(msg_askIfRenamedPropertly, { task: "warn", color: "reset" }))
    .pipe(logMsg(msg_warnRemainFiles, { task: "warn", color: "reset" }))
    .pipe(prompt.confirm({ message: msg_continue, default: true }))
    .pipe(logMsg(msg_moveAllToGood, { color: "reset" }))
    .pipe(logFile())
    .pipe(gulp.dest(dir_cuTempGoodJPGs));
};

gulp.task("checkNames", checkNames);
gulp.task("tryToRenameWrongAfterExifDate", tryToRenameWrongAfterExifDate);
gulp.task("flushAllToGood", flushAllToGood);
gulp.task("cleanupJpgRenamed", () => cleanUpDir(dir_cuTempJPGRenamed));
gulp.task(
  "renameWrongNames",
  gulp.series(
    "checkNames",
    "tryToRenameWrongAfterExifDate",
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
const msg_moveFotoCuSort = "Moved fotos to cuSort";
const msg_moveVidCuSort = "Moved videos to cuSort";

const movePhotosToCuSort = () => {
  return gulp
    .src(dir_cuTempNormalizedNames + "**/*")
    .pipe(logFile())
    .pipe(countFiles(msg_moveFotoCuSort))
    .pipe(gulp.dest(dir_cuSort));
};

const moveMP4sToCuSort = () =>
  gulp
    .src(dir_cuTempMP4s + "**/*")
    .pipe(logFile())
    .pipe(countFiles(msg_moveVidCuSort))
    .pipe(gulp.dest(dir_cuSort));

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

gulp.task("confirmRun", confirmTask("Do you want to run this task?"));
gulp.task("confirmCleanUp", confirmTask("Do you want to clean up cuTemp dir?"));
gulp.task("displayBanner", () => banner("cu-presort", "ANSI Shadow"));
gulp.task("cleanup", () => cleanUpDir(dir_cuTemp));

gulp.task(
  "default",
  gulp.series(
    "displayBanner",
    "confirmRun",
    "makeCuCopy",
    "firstSort",
    "renameExtensions",
    "renameWrongNames",
    "normalizeNames",
    "moveToCuSort",
    "confirmCleanUp",
    "cleanup"
  )
);
