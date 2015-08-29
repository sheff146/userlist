var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('connect', function () {
    connect.server({
        root: '.',
        livereload: false
    });
});

gulp.task('default', ['connect']);