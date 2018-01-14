/* eslint-disable no-console */

const figlet = require("figlet");
// [patorjk/figlet.js](https://github.com/patorjk/figlet.js)
// npm i figlet -S

module.exports = function banner(txt, font = "Standard") {
  console.log("\n");
  console.log(figlet.textSync(txt, font));
  return Promise.resolve();
};
