// Include gulp
var gulp = require('gulp');
// Include plugins
var imagemin = require('gulp-imagemin');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var imageminSvgo = require('imagemin-svgo');
var webp = require('gulp-webp');
var tinypng = require('gulp-tinypng-compress');
var imageminGiflossy = require('imagemin-giflossy');
// Set variables
var PNGImages = "images/original/*.png";
var JPEGImages = "images/original/*.jpg";
var GIFImages = "images/original/*.gif";
var outputFolder = "images/gulped";

gulp.task('optimize', function () {
  return gulp.src('images/original/*')
    .pipe(imagemin([
      // GIF
      imageminGiflossy({
        optimizationLevel: 3,
        optimize: 3, //keep-empty: Preserve empty transparent frames
        lossy: 2
      }),
      imageminJpegRecompress({
        loops:10,
        min: 30,
        max: 75,
        quality:'high',
        accurate: true,
        strip: true
      }),
      // SVG
      imageminSvgo({
        plugins: [
          {removeViewBox: false}
        ]
      })
    ]))
    .pipe(gulp.dest('images/gulped'));
});

gulp.task('tinypng', function () {
  return gulp.src('images/original/*.png')
    // PNG
    .pipe(tinypng({
      key: 'uB-zV5TEfa-byqO7Y6kZ5Y_2rIeX2niP',
      sigFile: 'images/.tinypng-sigs',
      log: true
    }))
    .pipe(gulp.dest('images/gulped'));
});

// Create WebP versions of everything
gulp.task('webpall', function () {

  return gulp.src('images/original/*.{jpg,png}')
    .pipe(webp({
      quality: 70
    }))
    .pipe(gulp.dest('images/gulped'));

});

//Watch for changes in files
gulp.task('watch', function() {
  //Watch image files
  gulp.watch('images/original/*', ['optimize','tinypng','webpall']);
});

// Default Task
gulp.task('default', ['optimize','tinypng','webpall','watch']);