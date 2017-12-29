const gulp = require("gulp");

// const plugins = require("gulp-load-plugins")();
// [jackfranklin/gulp-load-plugins: Automatically load in gulp plugins](https://github.com/jackfranklin/gulp-load-plugins)
// npm i gulp-load-plugins -S

const rename = require("gulp-rename");
// [hparra/gulp-rename: Rename files easily](https://github.com/hparra/gulp-rename)
// npm i gulp-rename -S

const filter = require("gulp-filter");
// [sindresorhus/gulp-filter: Filter files in a vinyl stream](https://github.com/sindresorhus/gulp-filter)
// npm i gulp-filter -S

const del = require("del");
// https://github.com/sindresorhus/del
// npm i del -S

const debug = require("gulp-debug");
// [sindresorhus/gulp-debug: Debug Vinyl file streams to see what files are run through your Gulp pipeline](https://github.com/sindresorhus/gulp-debug)
// npm i gulp-debug -D

const paths = {};

paths.cu = ".fotos/1_camera_upload/**/*";
paths.basicFilter = ".fotos/2_basic_filter/**/*";
paths.outputToBasicFilter = ".fotos/2_basic_filter/";
paths.outputToWrong = ".fotos/3_wrong/";
paths.clearBasic = ".fotos/2_basic_filter/*";
paths.clearWrong = ".fotos/3_wrong/*";

// not deal with streams
const tasks = {};

tasks.cleanDir = function(path) {
  return del(path);
};

tasks.clearWrong = async function() {
  await tasks.cleanDir(paths.clearWrong);
};

tasks.clearBasic = async function() {
  await tasks.cleanDir(paths.clearBasic);
};

tasks.clearAll = async function() {
  await tasks.cleanDir(paths.clearWrong);
  await tasks.cleanDir(paths.clearBasic);
};

// stream tasks
const pipes = {};

pipes.renameExt = function(from, to) {
  return rename(path => {
    // path.dirname += "/ciao";
    // path.basename += "-goodbye";
    path.extname = path.extname === from ? to : path.extname;
  });
};

pipes.filterByExt = function(ext) {
  return filter(`**/*${ext}`, { dot: true });
};

pipes.basicFilter = async function() {
  return await gulp
    .src(paths.cu)
    .pipe(pipes.renameExt(".jpeg", ".jpg"))
    .pipe(pipes.filterByExt(".jpg"))
    // .pipe(debug({ title: "test: " }))
    .pipe(gulp.dest(paths.outputToBasicFilter));
};

pipes.filterWrongNames = async function() {
  const regex = /\d{4}-\d{2}-\d{2}\s\d{2}\.\d{2}\.\d{2}(-\d)?(\s)?(-)?(\s)?(.+)?\.jpg/;
  return await gulp
    // .src(paths.basicFilter, { base: "./" })
    .src(paths.basicFilter)
    .pipe(pipes.fotoFilenameFilter(regex))
    .pipe(gulp.dest(paths.outputToWrong));
};

pipes.fotoFilenameFilter = function(regex) {
  const filterFiles = file => !regex.test(file.path);
  return filter(filterFiles, { dot: true });
};

// clear tasks
gulp.task("clear:all", tasks.clearAll);
gulp.task("clear:wrong", tasks.clearWrong);
gulp.task("clear:basic", tasks.clearBasic);

// main gulp tasks
gulp.task("basicFilter", pipes.basicFilter);
gulp.task("default", pipes.filterWrongNames);
