var gulp = require('gulp');
var ts = require('gulp-typescript');
var ghPages = require('gulp-gh-pages');

gulp.task('default', function() {
    var tsProject = ts.createProject('tsconfig.json');

    return tsProject.src()
        .pipe(ts(tsProject))
        .pipe(gulp.dest(".dist"));
    //return gulp.src('./dist/**/*')
    //    .pipe(ghPages());
});