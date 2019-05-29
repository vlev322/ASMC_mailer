const juice = require("juice");
const pug = require("pug");
const sass = require('node-sass');
const path = require("path");

const cssBuffer = sass.renderSync({
	file: path.resolve(`./template/style.sass`)
});

const style = cssBuffer.css.toString();

const html = pug.renderFile(path.resolve(`./template/index.pug`), {
	style
});

const result = juice(html);

console.log(result);