const gulp = require("gulp");

const prompt = require("gulp-prompt");
//[Freyskeyd/gulp-prompt: Add interactive console prompts to gulp](https://github.com/Freyskeyd/gulp-prompt)
// npm i gulp-prompt -S

function confirmTask(message = "some mgs?", defaultOpt = true) {
  return () =>
    gulp.src("./foo.js", { allowEmpty: true }).pipe(
      prompt.confirm({
        message,
        default: defaultOpt
      })
    );
}

function pressAny(message = "Continue?") {
  return () =>
    gulp.src("./foo.js", { allowEmpty: true }).pipe(
      prompt.prompt({
        type: "input",
        name: "pressAny",
        message,
        default: "[press Enter]"
      })
    );
}

module.exports = {
  confirmTask,
  pressAny
};
