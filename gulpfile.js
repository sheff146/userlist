var gulp = require('gulp');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

gulp.task('html', function () {
    gulp.src('./src/*.html')
        .pipe(gulp.dest('./bin/'));

    gulp.src('./src/templates/*.html')
        .pipe(gulp.dest('./bin/templates/'))
        .pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src('./src/js/*.js')
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('./bin/js'))
        .pipe(connect.reload());
});

gulp.task('css', function () {
    gulp.src('./src/css/app.css')
        .pipe(minifyCss(''))
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest('./bin/css'))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch("./src/css/*.css", ['css']);
    gulp.watch("./src/*.html", ['html']);
    gulp.watch("./src/templates/*.html", ['html']);
    gulp.watch("./src/js/*.js", ['js']);
});

gulp.task('connect', function () {
    connect.server({
        root: './bin',
        port: 8888
    });
});

gulp.task('build', ['html', 'js', 'css']);

gulp.task('default', ['build', 'connect', 'watch']);