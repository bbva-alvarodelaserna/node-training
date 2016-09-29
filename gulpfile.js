var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var raml2html = require('gulp-raml2html');
var jasmine = require('gulp-jasmine');
var processEnv = require('gulp-process-env');
var istanbul = require('gulp-istanbul');
var isparta = require('isparta');
var shell = require('gulp-shell');
var jsdoc = require('gulp-jsdoc3');

gulp.task('lint', function() {
  return gulp.src('./server/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('start', ['apidoc', 'techdoc', 'lint' , 'test' ], function () {
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
  return gulp.src([
      './server/**/*.js',
      '!./server/app.js',
      '!./server/routes.js',
      '!./server/api/user/models/**/*',
      '!./server/api/**/index.js',
      '!./server/api/health/healthResponses.js',
      '!./server/config/**/*',
      '!./server/components/errors.js',
      '!./server/components/global.js',
      '!./server/components/responses.js'
    ])
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
      reporters: ['text', 'text-summary', 'html', 'cobertura'],
      reportOpts: { dir: './coverage' }
    }))
    // .pipe(istanbul.enforceThresholds({ thresholds: { global: 75 } }))
    .pipe(env.restore());
});

gulp.task('techdoc', function (cb) {
  gulp.src(['README.md', './server/**/*.js'], {read: false})
    .pipe(jsdoc(cb));
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
