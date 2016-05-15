'use strict';

const gulp = require('gulp');
// const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');

gulp.task('test', function() {
  return gulp.src(__dirname + '/test/*.js')
  .pipe(mocha());
});
gulp.task('lint', function() {
  return gulp.src(['**/*.js', '!node_modules/**'])
  .pipe(eslint()).pipe(eslint.format());
});
gulp.task('default', ['lint'], function() {
});
