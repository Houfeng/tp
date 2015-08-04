var gulp = require("gulp");
var pkg = require("./package.json");
var uglify = require("gulp-uglify");
var del = require('del');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var header = require('gulp-header');
var replace = require('gulp-replace');

var banner = ['/**',
    ' * <%= pkg.rawName %>.js - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' * @author <%= pkg.author.name %>',
    ' * @email <%= pkg.author.email %>',
    ' */',
    ''
].join('\r\n');

gulp.task('clear', function(cb) {
    del(['build'], cb);
});

gulp.task('build', ["clear"], function() {
    gulp.src("./lib/**/*.js")
        .pipe(concat("all.js"))
        .pipe(rename(pkg.rawName + ".js"))
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(replace('/*{{version}}*/', 'owner.version = "' + pkg.version + '";'))
        .pipe(gulp.dest("./build/"))
        .pipe(uglify())
        .pipe(rename(pkg.rawName + ".min.js"))
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(gulp.dest("./build/"));
});

gulp.task('readme', function(cb) {
    gulp.src("./README.md")
        .pipe(replace('{{version}}', +pkg.version))
        .pipe(gulp.dest("./"));
});

gulp.task('default', ["clear", "build"]);

//end