const gulp = require("gulp");

const prompt = require("gulp-prompt");
//[Freyskeyd/gulp-prompt: Add interactive console prompts to gulp](https://github.com/Freyskeyd/gulp-prompt)
// npm i gulp-prompt -S

module.exports = function confirmTask(
  message = "some mgs?",
  defaultOpt = true
) {
  return () =>
    gulp.src("./package.json").pipe(
      prompt.confirm({
        message,
        default: defaultOpt
      })
    );
};
