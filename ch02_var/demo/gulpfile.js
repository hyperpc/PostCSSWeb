var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require("autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var rename = require('gulp-rename');
//var cssnano = require('cssnano');
var clean = require('gulp-clean');
var stylelint = require('stylelint');
var reporter = require('postcss-reporter');
//var sass = require('gulp-sass'); //node-sass
//var sass = require('sass'); //dart-sass
var sass = require('gulp-dart-sass'); //gulp-dart-sass

gulp.task('clean', function(){
	return gulp.src(['dest/*'])
		.pipe(clean());
});

gulp.task('lint-style', function(){
    return gulp.src('dest/*.css')
        .pipe(postcss([stylelint({
            "rules":{
                "color-no-invalid-hex":true,
                "color-hex-case": [
                  "lower",
                  {
                    "message": "Lowercase letters are easier to distinguish from numbers"
                  }
                ],
                "declaration-colon-space-after":"never",
                "declaration-colon-space-before":"never",
                "indentation":[
                    4,
                    {
                      "except": ["block"],
                      "message": "Please use 4 spaces for indentation.",
                      "severity": "warning"
                    }
                  ],
                "number-leading-zero":null
            }
        }),reporter({
            clearAllMessages: true,
        })]))
});

gulp.task('autoprefixer', function() {
    return gulp.src('dest/*.css')
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('maps/'))
        .pipe(gulp.dest('dest/'));
});

gulp.task('rename', function () {
    return gulp.src('dest/style.css')
        .pipe(rename('style.min.css'))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('maps/'))
        .pipe(gulp.dest("dest/"));
});

/* 1. 使用gulp原生的watch任务，监听已有文件的改动，无法监听新增的文件 */
gulp.task('watch', function(){
    gulp.watch('src/*.scss', gulp.series('default'))
        .on('change', function(event){
            console.log('File '+event+' was changed, running tasks...');
    })
});

gulp.task('sass', function(){
    return gulp.src('src/*.scss')
        .pipe(sass.sync({outputStyle:'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('dest/'));
});

// clean
gulp.task('default', gulp.series('clean', 'sass', 'lint-style', 'autoprefixer', 'rename', 'watch'));
