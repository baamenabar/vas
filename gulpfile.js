var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var imageResize = require('gulp-image-resize');
var imageMin = require('gulp-imagemin');
var livereload = require('gulp-livereload');
var vasConvert = require('./tasks/data.js');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('styles', function() {
  gulp.watch('./scss/ionic.app.scss', ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('images',function(done) {
  gulp.src('./src_data/imgs/*.*')
  /*.pipe(imageResize({
    width:770,
    height:770,
    imageMagick:true,
    quality:0.7
  }))
  .pipe(imageMin({
    progressive: true
  }))
  .pipe(gulp.dest('./www/img/species/770/'))
  .pipe(imageResize({
    width:640,
    height:480,
    imageMagick:true,
    quality:0.7
  }))
  .pipe(imageMin({
    progressive: true
  }))
  .pipe(gulp.dest('./www/img/species/640/'))*/
  .pipe(imageResize({
    width:320,
    height:240,
    imageMagick:true,
    quality:0.7
  }))
  .pipe(imageMin({
    progressive: true
  }))
  .pipe(gulp.dest('./www/img/species/320/'))
  .on('end',done);
});

gulp.task('convert',function() {
  vasConvert.convertCSV(function(){
    vasConvert.createThumbnails();
  });
});

gulp.task('thumbs',function() {
  /*vasConvert.createThumbnails(function() {
    console.log('terminamos copiado de thumbs');
    
  });*/
  gulp.src('./src_data/imgs/thumbs/*.*')
    .pipe(imageResize({
      width:400,
      height:300,
      crop : true,
      //imageMagick:true,
      quality:0.7
    }))
    .pipe(imageMin({
      progressive: true
    }))
    .pipe(gulp.dest('./www/img/species/thumbs/'));
});

gulp.task('terms',function() {
  vasConvert.termsManipulation();
});
