var gulp = require('gulp');
var chai = require('chai');
var Server = require('karma').Server;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate');
var clean = require('gulp-clean');
var path = require('path');
var plumber = require('gulp-plumber');
var jshint = require('gulp-jshint');
var map = require('map-stream');
var eventStream = require('event-stream');

// Root directory
var rootDirectory = path.resolve('./');

// Source directory for build process
var sourceDirectory = path.join(rootDirectory, './src');

var sourceFiles = [
  path.join(sourceDirectory, '/**/*.js'),
  path.join(rootDirectory, '/*footer.*')
];

var lintFiles = [
  'gulpfile.js'
  // Karma configuration
  // 'karma-*.conf.js'
].concat(sourceFiles);


// Build JavaScript distribution files
gulp.task('build', ['clean'], function() {
  return eventStream.merge(gulp.src(sourceFiles))
    .pipe(plumber())
    .pipe(concat('angular-actioncable.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(ngAnnotate())
    .pipe(uglify({mangle: false}))
    .pipe(rename('angular-actioncable.min.js'))
    .pipe(gulp.dest('./dist/'));
});

// removes the dist folder
gulp.task('clean', function () {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

// Validate source JavaScript
var map = require('map-stream');
var exitOnJshintError = map(function (file, cb) {
  if (!file.jshint.success) {
    console.error('jshint failed');
    process.exit(1);
  }
});
gulp.task('jshint', function () {
  gulp.src(lintFiles)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(exitOnJshintError);
});

// watch for changes
gulp.task('watch', function () {
  gulp.watch([sourceFiles], ['build']);
});

// Run test once and exit
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});



gulp.task('test-dist', function (done) {
  new Server({
    configFile: __dirname + '/karma-dist-concatenated.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('test-min', function (done) {
  new Server({
    configFile: __dirname + '/karma-dist-minified.conf.js',
    singleRun: true
  }, done).start();
});


gulp.task('serve', ['test', 'watch', 'build']);
gulp.task('default', ['test']);
