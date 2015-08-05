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

gulp.task('clear_build', function(cb) {
    del(['build'], cb);
});

gulp.task('clear_lib', function(cb) {
    del(['lib'], cb);
});

gulp.task('clear_bin', function(cb) {
    del(['bin'], cb);
});

gulp.task('clear', ['clear_build', 'clear_lib', 'clear_bin']);

gulp.task('build', ["clear"], function() {
    //tp
    gulp.src("./src/tp.js")
        .pipe(replace('{{version}}', pkg.version))
        .pipe(header(banner, pkg))
        .pipe(gulp.dest("./build/"))
        .pipe(uglify())
        .pipe(header(banner, pkg))
        .pipe(gulp.dest("./lib/"))
        .pipe(rename(pkg.rawName + ".min.js"))
        .pipe(gulp.dest("./build/"));
    //compile.js
    gulp.src("./src/compile.js")
        .pipe(replace('{{version}}', pkg.version))
        .pipe(uglify())
        .pipe(header(banner, pkg))
        .pipe(gulp.dest("./lib/"));
    //compile.tp
    gulp.src("./src/compile.tp")
        .pipe(replace('{{version}}', pkg.version))
        .pipe(header(banner, pkg))
        .pipe(gulp.dest("./lib/"));
    //cli
    gulp.src("./src/cli.js")
        .pipe(replace('{{version}}', pkg.version))
        .pipe(uglify())
        .pipe(header(banner, pkg))
        .pipe(gulp.dest("./bin/"));
});

gulp.task('readme', function(cb) {
    gulp.src("./README.src.md")
        .pipe(replace('{{version}}', pkg.version))
        .pipe(rename("README.md"))
        .pipe(gulp.dest("./"));
});

gulp.task('default', ["clear", "build", "readme"]);

//end