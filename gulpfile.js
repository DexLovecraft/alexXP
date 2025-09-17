const { src, dest, series, parallel } = require("gulp");
const cleanCSS = require("gulp-clean-css");
const terser = require("gulp-terser");
const htmlmin = require("gulp-htmlmin");

function minifyCSS() {
  return src("src/**/*.css", { base: "src" })
    .pipe(cleanCSS())
    .pipe(dest("dist"));
}

function minifyJS() {
  return src("src/**/*.js", { base: "src" })
    .pipe(terser())
    .pipe(dest("dist"));
}

function minifyHTML() {
  return src("src/**/*.html", { base: "src" })
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(dest("dist"));
}

function copyAssets() {
  return src("src/**/*.{png,jpg,jpeg,gif,svg,ico,webp,mp3,pdf}", { encoding: false, base: "src" })
    .pipe(dest("dist"));
}


exports.build = series(
  parallel(minifyCSS, minifyJS, minifyHTML, copyAssets),
);