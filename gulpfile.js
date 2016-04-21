"use strict";

// plugins
var gulp = require('gulp'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    connectLivereload = require('connect-livereload'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer');

var path = {
   src: 'src/',
  html: 'src/**/*.html',
    js: 'src/js/*.js',
  sass: 'src/sass/**/*.scss',
   css: 'src/css/',
}

var localPort = 4000,
       lrPort = 35729;

gulp.task('server', function(){
  var server = connect();

  server.use(connectLivereload({port: lrPort}));
  server.use(serveStatic(path.src));
  server.listen(localPort);

  console.log("\nlocal server running at http://localhost:" + localPort + "/\n");
});

gulp.task('sass', function(){
  gulp.src(path.sass)
    .pipe(sass({
      outputStyle: [ 'expanded' ],
      sourceComments: 'normal'
    }).on('error', sass.logError))
    .pipe(prefix())
    .pipe(gulp.dest(path.css));
})