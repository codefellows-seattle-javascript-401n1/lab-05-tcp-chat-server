'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');

gulp.task('runTests', () => {
  gulp.src(__dirname + '/test/*.js')
  .pipe(mocha());
});

gulp.task('runLint', () => {
  return gulp.src(['**/*.js','!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('watch', () => {
  gulp.watch(['**/*.js', '!node_modules/**'], ['runTests', 'runLint']);
});

gulp.task('default', ['runTests', 'runLint', 'watch'], () => {
});
