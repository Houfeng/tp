var gulp = require("gulp");
var pkg = require("./package.json");
var uglify = require("gulp-uglify");
var del = require('del');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var header = require('gulp-header');
var replace = require('gulp-replace');

var banner = ['/**',
    ' * <%= rawName %>.js - <%= description %>',
    ' * @version v<%= version %>',
    ' * @link <%= homepage %>',
    ' * @license <%= license %>',
    ' * @author <%= author.name %>',
    ' * @email <%= author.email %>',
    ' */',
    ''
].join('\r\n');

gulp.task('clear', function (cb) {
    del(['build'], cb);
});

gulp.task('build', ["clear"], function () {
    //tp
    gulp.src("./lib/tp.js")
        .pipe(replace('{{version}}', pkg.version))
        .pipe(header(banner, pkg))
        .pipe(gulp.dest("./build/"))
        .pipe(uglify())
        .pipe(header(banner, pkg))
        .pipe(rename(pkg.rawName + ".min.js"))
        .pipe(gulp.dest("./build/"));
});

gulp.task('readme', function (cb) {
    gulp.src("./README.src.md")
        .pipe(replace('{{version}}', pkg.version))
        .pipe(rename("README.md"))
        .pipe(gulp.dest("./"));
});

gulp.task('default', ["clear", "build", "readme"]);

//end