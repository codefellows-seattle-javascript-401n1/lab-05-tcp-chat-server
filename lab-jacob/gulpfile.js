const gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('lint', function() {
  return gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint({
      'rules': {
        'no-console': 0,
        'indent': [
          2,
          2
        ],
        'quotes': [
          2,
          'single'
        ],
        'linebreak-style': [
          2,
          'unix'
        ],
        'semi': [
          2,
          'always'
        ]
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
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('watch', function() {
  gulp.watch('**/*.js', ['lint']);
});

gulp.task('default', ['watch', 'lint']);
