const { src, dest, series, parallel } = require("gulp");
const cleanCSS = require("gulp-clean-css");
const terser = require("gulp-terser");
const htmlmin = require("gulp-htmlmin");

// Minify CSS
function minifyCSS() {
  return src("src/**/*.css")
    .pipe(cleanCSS())
    .pipe(dest("dist"));
}

// Minify JS
function minifyJS() {
  return src("src/**/*.js")
    .pipe(terser())
    .pipe(dest("dist"));
}

// Minify HTML
function minifyHTML() {
  return src("src/**/*.html")
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(dest("dist"));
}

// Copier autres fichiers (images, icônes, etc.)
function copyAssets() {
  return src("src/**/*.{png,jpg,jpeg,gif,svg,ico,webp}")
    .pipe(dest("dist"));
}

// Définir la tâche build
exports.build = series(
  parallel(minifyCSS, minifyJS, minifyHTML, copyAssets)
);