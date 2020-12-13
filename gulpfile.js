"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var pug = require('gulp-pug');
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");

gulp.task("fonts", ()=>{
  return gulp.src("src/fonts/**/*.*")
    .pipe(gulp.dest("public/fonts"));
});

gulp.task("img", ()=>{
  return gulp.src(["src/img/**/*.*", "src/elements/**/*.svg", "src/elements/**/*.jpg", "src/elements/**/*.png"])
    .pipe(gulp.dest("public/img"));
});

gulp.task("js", ()=>{
  return gulp.src("src/js/**/*.js")
    .pipe(gulp.dest("public/js"));
});

gulp.task("pug", ()=>{
  return gulp.src(["src/pug/**/*.pug", "!src/pug/templates/**/*.pug"])
    .pipe(pug({pretty:true}))
    .pipe(gulp.dest('public'))
});

gulp.task("css", ()=>{
  return gulp.src("src/sass/index.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style_min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("public/css"))
    .pipe(server.stream());
});

gulp.task("server", ()=>{
  server.init({
    server: "public/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("src/elements/**/*.*", gulp.series("img", "js", "pug", "css"));
  gulp.watch("src/fonts/**/*.*", gulp.series("fonts"));
  gulp.watch("src/img/**/*.*", gulp.series("img"));
  gulp.watch("src/js/**/*.js", gulp.series("js"));
  gulp.watch("src/pug/**/*.pug", gulp.series("pug"));
  gulp.watch("src/sass/**/*.scss", gulp.series("css"));
  gulp.watch("src/*.html").on("change", server.reload);
});

gulp.task("build", gulp.series("fonts", "img", "js", "pug", "css"));
gulp.task("start", gulp.series("build", "server"));
