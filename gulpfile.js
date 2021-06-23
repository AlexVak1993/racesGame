'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sourcemaps = require('gulp-sourcemaps'),
    rimraf = require('rimraf'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,

    fileinclude = require('gulp-file-include'),

    sass = require('gulp-sass'),
    prefixer = require('gulp-autoprefixer'),
    postcss = require('gulp-postcss'),
    mqpacker = require('css-mqpacker'),
    sortCSSmq = require('sort-css-media-queries'),
    cssmin = require('gulp-clean-css'),

    babel = require('gulp-babel'),
    ts = require('gulp-typescript'),
    rigger = require('gulp-rigger'),

    rename = require('gulp-rename'),

    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    pngquant = require('imagemin-pngquant');

    var path = {
        build: {
          html: 'build/',
          js: 'build/js/',
          css: 'build/css/',
          img: 'build/images/',
          fonts: 'build/fonts/',
          video:'build/video/'
        },
        src: { 
          html: 'src/*.html',
          ts: ['src/ts/*.ts'],
          style: 'src/scss/main.scss',
          img: 'src/images/**/*.*', 
          fonts: 'src/fonts/**/*.*',
          video:'src/video/**/*.*'
        },
        watch: { 
          html: 'src/**/*.html',
          ts: 'src/ts/**/*.ts',
          style: 'src/scss/**/*.scss',
          img: 'src/images/**/*.*',
          fonts: 'src/fonts/**/*.*',
          video:'src/video/**/**/**/*.*'
        },
        clean: './build'
  };

  var config = {
      server: {
          baseDir: "./build"
      },
      tunnel: false,
      host: 'localhost',
      port: 3000,
      logPrefix: "Frontend"
};

gulp.task('html:build', async function () {
  gulp.src(path.src.html)
      // .pipe(rigger())
      .pipe(fileinclude())
      .pipe(gulp.dest(path.build.html))
      .pipe(reload({stream: true}));
});
gulp.task('video:build', async function () {
  gulp.src(path.src.video)
        .pipe(gulp.dest(path.build.video))
      .pipe(reload({stream: true}));
});

gulp.task('js:build', async function () {
  gulp.src(path.src.ts)
      // .pipe(rigger())
      // .pipe(fileinclude())
      .pipe(ts({
        // noImplicitAny: true,
        outFile: 'main.js'
      }))
      // .pipe(
      //   babel({
      //     presets: ["@babel/env"],
      //   })
      // )
      // .pipe(sourcemaps.init())
      // .pipe(sourcemaps.write())
      // .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(path.build.js))
      .pipe(reload({stream: true}))
});

gulp.task('style:build', async function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(prefixer('last 2 versions'))
        .pipe(postcss([mqpacker({
          sort: sortCSSmq
        })]))
        // .pipe(cssmin())
        .pipe(sourcemaps.write())
        // .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', async function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});


//compressing all images

var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var imageminWebp = require('imagemin-webp');
var imageminPngquant = require('imagemin-pngquant');
var imageminZopfli = require('imagemin-zopfli');
var imageminMozjpeg = require('imagemin-mozjpeg'); //need to run 'brew install libpng'
var imageminGiflossy = require('imagemin-giflossy');

gulp.task('image:build', async function() {
  return gulp.src(path.src.img)
      // .pipe(webp())
      .pipe(cache(imagemin([
          //png
          imageminWebp({quality: 10}),
          imageminPngquant({
              speed: 1,
              quality: [0.95, 1] //lossy settings
          }),
          imageminZopfli({
              more: true
              // iterations: 50 // very slow but more effective
          }),
          //gif
          // imagemin.gifsicle({
          //     interlaced: true,
          //     optimizationLevel: 3
          // }),
          //gif very light lossy, use only one of gifsicle or Giflossy
          imageminGiflossy({
              optimizationLevel: 3,
              optimize: 3, //keep-empty: Preserve empty transparent frames
              lossy: 2
          }),
          //svg
          imagemin.svgo({
              plugins: [{
                  removeViewBox: false
              }]
          }),
          //jpg lossless
          imagemin.jpegtran({
              progressive: true
          }),
          //jpg very light lossy, use vs jpegtran
          imageminMozjpeg({
              quality: 10
          })
      ])))
      .pipe(gulp.dest(path.build.img)); //И бросим в build
});

gulp.task('build', gulp.series( 
  'html:build',
  'js:build',
  'style:build',
  'fonts:build',
  'image:build',
  'video:build'
));

gulp.task('watch', function(){
  watch([path.watch.html], function(event, cb) {
    gulp.parallel('html:build');
  });
});

gulp.task('watch', function(done){
  gulp.watch([path.watch.html], gulp.series('html:build')),
  gulp.watch([path.watch.style], gulp.series('style:build')),
  gulp.watch([path.watch.ts], gulp.series('js:build')),
  gulp.watch([path.watch.img], gulp.series('image:build')),
  gulp.watch([path.watch.fonts], gulp.series('fonts:build')),
  gulp.watch([path.watch.video], gulp.series('video:build'))
  done();
});


gulp.task('webserver', function () {
  browserSync(config);
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('default', gulp.parallel('build', 'webserver', 'watch'));

