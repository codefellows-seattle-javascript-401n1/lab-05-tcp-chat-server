'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');

gulp.task('tests', function() {
  gulp.src(__dirname + '/test/test-*.js').pipe(mocha());
});

gulp.task('linter', function() {
  const opts = {
    'rules': {
      'no-console': 0,
      'indent': [2, 2],
      'quotes': [2, 'single'],
      'linebreak-style': [2, 'unix'],
      'semi': [2, 'always']
    },
    'env': {
      'es6': true,
      'node': true,
      'browser': true
    },
    'globals': {
      'describe': false,
      'it': false,
      'beforeEach': false,
      'afterEach': false,
      'before': false,
      'after': false
    },
    'ecmaFeatures': {
      'modules': true,
      'experimentalObjectRestSpread': true,
      'impliedStrict': true
    },
    'extends': 'eslint:recommended'
  };
  return gulp.src(['**/*.js', '!node_modules/**'])
  .pipe(eslint(opts))
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('watch', function() {
  gulp.watch(['**/*.js', '!node_modules'], ['linter'], function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

gulp.task('default', ['tests', 'linter']);
