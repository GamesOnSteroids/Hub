var gulp = require('gulp');
var ts = require('gulp-typescript');
var ghPages = require('gulp-gh-pages');
var del = require('del');

gulp.task("default", ["compile-typescript", "copy-files"], function () {
    return gulp.src('.dist/**/*')
        .pipe(ghPages());
});

gulp.task('copy-files', function() {

    return gulp.src(["CNAME", "favicon.ico", "index.html", "./app/**/*.{html,css,png,ogg,wav}"], {base: "."})
        .pipe(gulp.dest(".dist"));
});

gulp.task('compile-typescript', function() {
    var tsProject = ts.createProject('tsconfig.json');

    return tsProject.src()
        .pipe(ts(tsProject))
        .pipe(gulp.dest(".dist"));
});