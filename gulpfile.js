const gulp = require("gulp");

const rename = require("gulp-rename");
// [hparra/gulp-rename: Rename files easily](https://github.com/hparra/gulp-rename)
// npm i gulp-rename -S

const del = require("del");
// https://github.com/sindresorhus/del
// npm i del -S

const debug = require("gulp-debug");
// [sindresorhus/gulp-debug: Debug Vinyl file streams to see what files are run through your Gulp pipeline](https://github.com/sindresorhus/gulp-debug)
// npm i gulp-debug -D

const paths = {};

paths.cu = ".fotos/cu/**/*";
paths.cuBackup = ".fotos/cuBackup/";

const cleanDir = path => del(path);
const cleanDir_cuBackup = () => cleanDir(paths.cuBackup);

const renameExt = (from, to) =>
  rename(path => {
    // path.dirname += "/ciao";
    // path.basename += "-goodbye";
    path.extname = path.extname === from ? to : path.extname;
  });

const pipes = {};

pipes.rename = function() {
  return (
    gulp
      .src(paths.cu)
      .pipe(renameExt(".jpeg", ".jpg"))
      // .pipe(debug({ title: "List of files: " }))
      .pipe(gulp.dest(paths.cuBackup))
  );
};

gulp.task("rename", pipes.rename);
gulp.task("cleanDev", cleanDir_cuBackup);
gulp.task("default", gulp.series("rename"));
