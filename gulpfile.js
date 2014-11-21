"use strict";

// Plugins
var            gulp = require( 'gulp' ),
            connect = require( 'connect' ),
  connectLivereload = require( 'connect-livereload' ),
     gulpLivereload = require( 'gulp-livereload' ),
               sass = require( 'gulp-sass' ),
             prefix = require( 'gulp-autoprefixer' ),
             jshint = require( "gulp-jshint" ),
            stylish = require( 'jshint-stylish' );

// source assets
var src = {
     root: 'src/',
     html: 'src/**/*.html',
     sass: 'src/sass/**/*.scss',
       js: 'src/js/**/*.js',
      img: 'src/img/**/*'
};

// distribution directories
var dist = {
  root: 'dist/',
   css: 'dist/css/',
    js: 'dist/js/',
   img: 'dist/img/'
};

// ignore any vendor files
var ignoreVendor = '!src/**/vendor/**/*';

// ports
var localPort =  4000,
       lrPort = 35729;

// start local server
gulp.task( 'server', function() {
  var server = connect();

  server.use( connectLivereload( { port: lrPort } ) );
  server.use( connect.static( dist.root ) );
  server.listen( localPort );

  console.log( "\nlocal server running at http://localhost:" + localPort + "/\n" );
});

// jshint
gulp.task( 'jshint', function() {
  gulp.src( [ src.js, ignoreVendor ] )
    .pipe( jshint() )
    .pipe( jshint.reporter( stylish ) );
});

// compile sass
gulp.task( 'sass', function() {
  gulp.src( src.sass )
    .pipe( sass({
      outputStyle: [ 'expanded' ],
      sourceComments: 'normal',
      errLogToConsole: true
    }))
    .pipe( prefix() )
    .pipe( gulp.dest( dist.css ) );
});

// copy javascript
gulp.task( 'copyJs', function() {
  gulp.src( src.js )
    .pipe( gulp.dest( dist.js ) );
});

// copy html
gulp.task( 'copyHtml', function() {
  gulp.src( src.html )
    .pipe( gulp.dest( dist.root ) );
});

// copy images
gulp.task( 'copyImg', function() {
  gulp.src( src.img )
    .pipe( gulp.dest( dist.img ) );
});

// watch file
gulp.task( 'watch', function( done ) {
  var lrServer = gulpLivereload();

  gulp.watch( dist.root + '**/*' )
    .on( 'change', function( file ) {
      lrServer.changed( file.path );
    });

  gulp.watch( src.html, [ 'copyHtml' ] );

  gulp.watch( src.sass, [ 'sass' ] );

  gulp.watch( src.js, [ 'jshint', 'copyJs' ] );

  gulp.watch( src.img, [ 'copyImg' ] );
});

// default task
gulp.task( 'default', [ 'server', 'watch' ] );