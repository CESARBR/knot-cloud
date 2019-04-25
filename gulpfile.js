const gulp = require('gulp');

gulp.task('default', function () {
  return gulp.src(['stacks/**/*'], {
      base: '.'
  }).pipe(gulp.dest('build'));
});
