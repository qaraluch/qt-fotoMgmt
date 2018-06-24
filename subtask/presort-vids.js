/* eslint-disable no-console */

const gulp = require("gulp");

const prompt = require("gulp-prompt");
//[Freyskeyd/gulp-prompt: Add interactive console prompts to gulp](https://github.com/Freyskeyd/gulp-prompt)
// npm i gulp-prompt -S

const debug = require("gulp-debug");
// [sindresorhus/gulp-debug: ](https://github.com/sindresorhus/gulp-debug)
// npm i gulp-debug -D

// FNS:
const paths = require("../fns/load-paths.js")("../paths.json", "QT_FOTOMGMT");
// Different paths are loaded. It is based on env variable: $QT_FOTOMGMT (dev/prod).
const cleanUpDir = require("../fns/cleanup-dir");
const banner = require("../fns/banner");
const filterByExt = require("../fns/filter-by-ext");
const deleteSrcFiles = require("../fns/delete-src-files");
const logFile = require("../fns/log-file");
const logMsg = require("../fns/log-msg");
const logTask = require("../fns/log-task");
const renameExt = require("../fns/rename-ext");
const filterWrongFileNames = require("../fns/filter-wrong-filenames");
const renameAfterExifDate = require("../fns/rename-after-exif-date")(); //lazypipe
const normalizePhotoNames = require("../fns/normalize-photo-names");
const { confirmTask, pressAny } = require("../fns/confirm-task");
const bumpFotoVersion = require("../fns/bump-foto-version");
const countFiles = require("../fns/count-files");
const tester = require("../fns/tester");
const testerReport = require("../fns/tester-report-presort");

/********************************
 *  TESTER
 ********************************/
const presortTester = tester();

const spawnTesterCb = propertyName => count =>
  presortTester.add(propertyName, count);

gulp.task("testing", () => {
  presortTester.show(testerReport);
  return Promise.resolve();
});

gulp.task(
  "logDoneTesting",
  logTask("Tested results of the task!", {
    task: "done",
    color: "green"
  })
);

gulp.task("testIt", gulp.series("testing", "logDoneTesting"));

/********************************
 *  PATHS
 ********************************/

// TASK: firstSort
const dir_cu = paths.cu;

const dir_cuTempCopyCu = paths.cuTemp + "cuCopy/";
// const dir_cuTempJPGs = paths.cuTemp + "jpgs/";
// const dir_cuTempJPEGs = paths.cuTemp + "jpegs/";
// const dir_cuTempBigJPGs = paths.cuTemp + "bigJPGs/";
const dir_cuTempVids = paths.cuTemp + "vids/";
// const dir_cuTempGIFs = paths.cuTemp + "gifs/";
// const dir_cuTempPNGs = paths.cuTemp + "pngs/";

// TASK: renameExtensions
// const dir_cuTempFlushJPGs = paths.cuTemp + "flushJPGs/";

// TASK: renameWrongNames
// const dir_cuTempGoodJPGs = paths.cuTemp + "goodJPGs/";
// const dir_cuTempJPGRenamed = paths.cuTemp + "jpgRenamed/";

// TASK: normalizeNames
// const dir_cuTempNormalizedNames = paths.cuTemp + "normalizedNames/";

// TASK: moveToCuSort
const dir_cuSort = paths.cuSort;

const dir_cuTemp = paths.cuTemp;

/*************************************************************************
 *  TASK: copyCu
 *************************************************************************/
const msg_countFiles = "        Total";
const msg_forLogFile = "      - ";

const makeCuCopyVids = () =>
  gulp
    .src([dir_cu + "**/*.mp4", dir_cu + "**/*.MP4"])
    .pipe(deleteSrcFiles())
    .pipe(logFile(msg_forLogFile))
    .pipe(countFiles(msg_countFiles, spawnTesterCb("cu")))
    .pipe(gulp.dest(dir_cuTempVids));

gulp.task(
  "logAboutCuCopy",
  logTask("About to start: moving files to temporary dir (cuCopy/vids)...", {
    task: "start",
    color: "blue",
    emptyLineAfter: false
  })
);

gulp.task(
  "logDoneCuCopy",
  logTask("Moved photos to cuCopy/vids dir.", {
    task: "done",
    color: "green"
  })
);

gulp.task("makeCuCopyVids", makeCuCopyVids);
gulp.task(
  "cuCopyVids",
  gulp.series("logAboutCuCopy", "makeCuCopyVids", "logDoneCuCopy")
);

/*************************************************************************
 *  TASK: renameExtensions
 *************************************************************************/

const renameExtensions = () =>
  gulp
    .src(dir_cuTempVids + "**/*.MP4", { base: "./" })
    .pipe(renameExt(".MP4", ".mp4"))
    .pipe(gulp.dest("."));

gulp.task(
  "logAboutRenameExt",
  logTask("About to start: renaming extensions...", {
    task: "start",
    color: "blue",
    emptyLineAfter: false
  })
);

gulp.task(
  "logDoneRenameExt",
  logTask("Renamed photos by their extensions.", {
    task: "done",
    color: "green"
  })
);

gulp.task("runRenameExtensions", renameExtensions);
gulp.task(
  "renameExtensions",
  gulp.series("logAboutRenameExt", "runRenameExtensions", "logDoneRenameExt")
);

// /*************************************************************************
//  *  TASK: renameExtensions
//  *************************************************************************/
// const renameBIGJPGs = () =>
//   gulp
//     .src(dir_cuTempBigJPGs + "**/*")
//     .pipe(renameExt(".JPG", ".jpg"))
//     .pipe(gulp.dest(dir_cuTempFlushJPGs));

// const renameJPEGs = () =>
//   gulp
//     .src(dir_cuTempJPEGs + "**/*")
//     .pipe(renameExt(".jpeg", ".jpg"))
//     .pipe(bumpFotoVersion(1))
//     // bump ver to avoid overwriting modified fotos
//     // 1 due to jpegs are modified ones so must have next version
//     .pipe(gulp.dest(dir_cuTempFlushJPGs));

// const moveJPGs = () =>
//   gulp.src(dir_cuTempJPGs + "**/*").pipe(gulp.dest(dir_cuTempFlushJPGs));

// gulp.task(
//   "logDoneExtRename",
//   logTask("Renamed photos by their extensions.", {
//     task: "done",
//     color: "green"
//   })
// );

// gulp.task("renameBIGJPGs", renameBIGJPGs);
// gulp.task("cleanupBIGJPGs", () => cleanUpDir(dir_cuTempBigJPGs));
// gulp.task("renameJPEGs", renameJPEGs);
// gulp.task("cleanupJPEGs", () => cleanUpDir(dir_cuTempJPEGs));
// gulp.task("moveJPGs", moveJPGs);
// gulp.task("cleanupJPGs", () => cleanUpDir(dir_cuTempJPGs));
// gulp.task(
//   "renameExtensions",
//   gulp.series(
//     gulp.parallel("renameBIGJPGs", "renameJPEGs", "moveJPGs"),
//     gulp.parallel("cleanupBIGJPGs", "cleanupJPEGs", "cleanupJPGs"),
//     "logDoneExtRename"
//   )
// );

// /*************************************************************************
//  *  TASK: renameWrongNames
//  *************************************************************************/
// // jpgFlush will remain due to some files may not be renamed
// const regexForCheckNames = /\d{4}-\d{2}-\d{2}\s\d{2}\.\d{2}\.\d{2}(-\d)?(\s)?(-)?(\s)?(.+)?\.jpg/;

// const checkNames = () =>
//   gulp
//     .src(dir_cuTempFlushJPGs + "**/*")
//     .pipe(filterWrongFileNames(regexForCheckNames))
//     .pipe(deleteSrcFiles())
//     .pipe(debug({ title: " - " }))
//     .pipe(gulp.dest(dir_cuTempGoodJPGs));

// const msg_tryToRename = "Try to rename files in jpgFlush dir after exif date!";

// const tryToRenameWrongAfterExifDate = () =>
//   gulp
//     .src(dir_cuTempFlushJPGs + "**/*")
//     .pipe(logMsg(msg_tryToRename, { task: "warn" }))
//     .pipe(renameAfterExifDate())
//     .pipe(gulp.dest(dir_cuTempJPGRenamed));

// const msg_askIfRenamedPropertly = "All files renamed correctly?";
// const msg_continue = "Continue task run?";
// const msg_warnRemainFiles =
//   "All wrong files will remain in flushJPGs (for manual renaming)";
// const msg_moveAllToGood = "Moving all renamed files to goodJPGs dir...";

// const flushAllToGood = () => {
//   return gulp
//     .src(dir_cuTempJPGRenamed + "**/*")
//     .pipe(logMsg(msg_askIfRenamedPropertly, { task: "warn", color: "reset" }))
//     .pipe(logMsg(msg_warnRemainFiles, { task: "warn", color: "reset" }))
//     .pipe(prompt.confirm({ message: msg_continue, default: true }))
//     .pipe(logMsg(msg_moveAllToGood, { color: "reset" }))
//     .pipe(debug({ title: " - " }))
//     .pipe(gulp.dest(dir_cuTempGoodJPGs));
// };

// gulp.task(
//   "logDoneRenameWrongNames",
//   logTask("Renamed wrong names by exif date.", {
//     task: "done",
//     color: "green"
//   })
// );

// gulp.task("checkNames", checkNames);
// gulp.task("tryToRenameWrongAfterExifDate", tryToRenameWrongAfterExifDate);
// gulp.task("flushAllToGood", flushAllToGood);
// gulp.task("cleanupJpgRenamed", () => cleanUpDir(dir_cuTempJPGRenamed));
// gulp.task(
//   "renameWrongNames",
//   gulp.series(
//     "checkNames",
//     "tryToRenameWrongAfterExifDate",
//     "flushAllToGood",
//     "cleanupJpgRenamed",
//     "logDoneRenameWrongNames"
//   )
// );

// /*************************************************************************
//  *  TASK: normalizeNames
//  *************************************************************************/
// const normalizeJPGNames = () => {
//   return gulp
//     .src(dir_cuTempGoodJPGs + "**/*")
//     .pipe(normalizePhotoNames())
//     .pipe(countFiles(msg_countFiles))
//     .pipe(gulp.dest(dir_cuTempNormalizedNames));
// };

// const normalizePNGNames = () => {
//   return gulp
//     .src(dir_cuTempPNGs + "**/*")
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
// gulp.task("normalizePNGNames", normalizePNGNames);
// gulp.task("cleanupGoodJPGs", () => cleanUpDir(dir_cuTempGoodJPGs));
// gulp.task("cleanupPNGs", () => cleanUpDir(dir_cuTempPNGs));

// gulp.task(
//   "normalizeNames",
//   gulp.series(
//     "normalizeJPGNames",
//     "normalizePNGNames",
//     "cleanupGoodJPGs",
//     "cleanupPNGs",
//     "logDoneNormalizeNames"
//   )
// );

// /*************************************************************************
//  *  TASK: moveToCuSort
//  *************************************************************************/
// const msg_moveFotoCuSort = "      - Moved fotos to cuSort";
// const msg_moveVidCuSort = "      - Moved videos to cuSort";
// const msg_moveGifCuSort = "      - Moved gifs to cuSort";

// const movePhotosToCuSort = () => {
//   return gulp
//     .src(dir_cuTempNormalizedNames + "**/*")
//     .pipe(logFile(msg_forLogFile))
//     .pipe(countFiles(msg_moveFotoCuSort, spawnTesterCb("photos")))
//     .pipe(gulp.dest(dir_cuSort));
// };

// const moveMP4sToCuSort = () =>
//   gulp
//     .src(dir_cuTempMP4s + "**/*")
//     .pipe(logFile(msg_forLogFile))
//     .pipe(countFiles(msg_moveVidCuSort, spawnTesterCb("mp4s")))
//     .pipe(gulp.dest(dir_cuSort));

// const moveGIFsToCuSort = () =>
//   gulp
//     .src(dir_cuTempGIFs + "**/*")
//     .pipe(logFile(msg_forLogFile))
//     .pipe(countFiles(msg_moveGifCuSort, spawnTesterCb("gifs")))
//     .pipe(gulp.dest(dir_cuSort));

// gulp.task(
//   "logDoneMoveCuSort",
//   logTask("Moved all photos to cuSort dir.", {
//     task: "done",
//     color: "green"
//   })
// );

// gulp.task("movePhotosToCuSort", movePhotosToCuSort);
// gulp.task("moveMP4sToCuSort", moveMP4sToCuSort);
// gulp.task("moveGIFsToCuSort", moveGIFsToCuSort);
// gulp.task("cleanupNormalizedNames", () =>
//   cleanUpDir(dir_cuTempNormalizedNames)
// );
// gulp.task("cleanupMp4s", () => cleanUpDir(dir_cuTempMP4s));
// gulp.task("cleanupGIFs", () => cleanUpDir(dir_cuTempGIFs));
// gulp.task(
//   "moveToCuSort",
//   gulp.series(
//     "movePhotosToCuSort",
//     "moveMP4sToCuSort",
//     "moveGIFsToCuSort",
//     gulp.parallel("cleanupNormalizedNames", "cleanupMp4s", "cleanupGIFs"),
//     "logDoneMoveCuSort"
//   )
// );

/*************************************************************************
 *  DEFAULT
 *************************************************************************/
// Default FNs
gulp.task("displayBanner", () => banner("presort-vids", "ANSI Shadow"));
gulp.task("confirmRun", confirmTask("Do you want to run this task?"));
gulp.task("pressAnyToContinue", pressAny());
gulp.task("confirmCleanUp", confirmTask("Do you want to clean up cuTemp dir?"));
gulp.task("cleanup", () => cleanUpDir(dir_cuTemp));
gulp.task(
  "logDoneCleanup",
  logTask("clean up cuTemp dir.", {
    task: "done",
    color: "green"
  })
);

gulp.task(
  "default",
  gulp.series(
    "displayBanner",
    "confirmRun",
    "cuCopyVids",
    // "pressAnyTocontinue",
    "renameExtensions"
    // "pressAnyToContinue",
    // "renameWrongNames",
    // "pressAnyToContinue",
    // "normalizeNames",
    // "pressAnyToContinue",
    // "moveToCuSort",
    // "pressAnyToContinue",
    // "testIt",
    // "confirmCleanUp",
    // "cleanup",
    // "logDoneCleanup"
  )
);
