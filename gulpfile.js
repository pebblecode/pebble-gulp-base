"use strict";

// Plugins
var            gulp = require('gulp'),
            connect = require('connect'),
  connectLivereload = require('connect-livereload'),
     gulpLivereload = require('gulp-livereload'),
               sass = require('gulp-sass'),
             prefix = require('gulp-autoprefixer'),
             jshint = require('gulp-jshint'),
           sequence = require('gulp-sequence'),
             rimraf = require('rimraf'),
            stylish = require('jshint-stylish');

// paths & files
var path = {
        src: 'src/',
       html: 'src/**/*.html',
         js: 'src/js/*.js',
       sass: 'src/sass/**/*.scss',
        css: 'src/css/',
};

// ports
var localPort =  4000,
       lrPort = 35729;

// start local server
gulp.task( 'server', function() {
  var server = connect();

  server.use( connectLivereload( { port: lrPort } ) );
  server.use( connect.static( path.src ) );
  server.listen( localPort );

  console.log( "\nlocal server running at http://localhost:" + localPort + "/\n" );
});

// jshint
gulp.task( 'jshint', function() {
  gulp.src( path.js )
    .pipe( jshint() )
    .pipe( jshint.reporter( stylish ) );
});

// compile sass
gulp.task( 'sass', function() {
  gulp.src( path.sass )
    .pipe(sass().on('error', sass.logError))
    .pipe( sass({
      outputStyle: [ 'expanded' ],
      sourceComments: 'normal'
    }))
    .pipe( prefix() )
    .pipe( gulp.dest( path.css ) );
});

gulp.task('sass:build', function() {
  gulp.src( path.sass )
  .pipe( sass({
    outputStyle:'compressed'
  }))
  .pipe( prefix() )
  .pipe( gulp.dest( path.css ) );
});

// watch file
gulp.task( 'watch', function(done) {
  var lrServer = gulpLivereload();

  gulp.watch( [ path.html, path.js, path.css + '/**/*.css' ] )
    .on( 'change', function( file ) {
      lrServer.changed( file.path );
    });

  gulp.watch( path.js, ['jshint'] );

  gulp.watch( path.sass, ['sass'] );
});

// default task
gulp.task( 'default', [ 'server', 'watch' ] );

gulp.task('copy:build', function() {
  gulp.src([
    './src/css/**/*.css',
    './src/**/*.html',
    './src/js/**/*.js',
    './src/fonts/**/*.*',
    './src/doc/**/*.*',
    './src/img/**/*.*',
    './src/favicon.ico'
  ], { base: './src' })
  .pipe(gulp.dest('dist'));
});

gulp.task('clean', function(cb) {
  rimraf('./dist', cb);
})

gulp.task('build', function(cb) {
  sequence('clean', 'sass:build', 'copy:build')(cb);
});
