var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var raml2html = require('gulp-raml2html');
var jasmine = require('gulp-jasmine');
var processEnv = require('gulp-process-env');
var istanbul = require('gulp-istanbul');
var isparta = require('isparta');
var shell = require('gulp-shell');

gulp.task('lint', function() {
  return gulp.src('./server/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('start', ['apidoc', 'lint' , 'test' ], function () {
  nodemon({
    script: 'server/app.js',
    ext: 'js',
    env: { '_NODE_ENV': 'development' },
    tasks: ['lint']
  })
  .on('restart', function () {
    console.log('server restarted!');
  });
});


gulp.task('apidoc', function() {
  return gulp.src('raml/api.raml')
    .pipe(raml2html())
    .pipe(gulp.dest('documentation'));
});
  


gulp.task('pre-test', function () {
  return gulp.src(['./server/**/*.js'])
    .pipe(istanbul({
      instrumenter: isparta.Instrumenter,
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});


gulp.task('test', ['pre-test'], function() {
  var env = processEnv({_NODE_ENV: 'test'});
  return gulp.src('tests/**/*.js')
    .pipe(env)           // Sets the environment
    .pipe(jasmine())
    .pipe(istanbul.writeReports({
      reporters: ['text', 'text-summary']
    }))
    // .pipe(istanbul.enforceThresholds({ thresholds: { global: 85 } }))
    .pipe(env.restore());
});

gulp.task('tests.watch', function () {
  gulp.start('test');
  gulp.watch('./tests/**/*.js', ['test']);
});



gulp.task('default', ['start']);



gulp.task('deploy', shell.task([
  'sh marathon_deploy.sh'
], {
  interactive: true
}));