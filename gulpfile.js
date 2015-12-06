var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var jshint       = require('gulp-jshint');
var uglify       = require('gulp-uglify');
var gulpSequence = require('gulp-sequence');
var imagemin     = require('gulp-imagemin');
var harp         = require('harp');

var projectPath = '.';
var projectDest = 'www';

gulp.task('serve', function() {
  harp.server(projectPath, {
    ip: '0.0.0.0',
    port: 9000
  }, function() {
    this.projectPath
  })
});

gulp.task('browser-sync', function() {
  browserSync({
    proxy: "localhost:9000",
    open: false
  });
});

gulp.task('jshint', function() {
  return gulp.src('public/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('compile', function (done) {
  harp.compile(projectPath, projectDest, done);
});

gulp.task('watch', function () {
  gulp.watch('public/**/*.js', ['jshint']);
  gulp.watch('public/**/*.{js,jade,styl,haml,sass,scss,less,ejs,css,html,md,json}', browserSync.reload);
});

gulp.task('scripts', function() {
  return gulp.src(['./public/**/*.js'], {base: './public'})
    .pipe(uglify())
    .pipe(gulp.dest(projectDest));
});

gulp.task('images', function() {
  return gulp.src('./public/images/*', {base: './public'})
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest('www/images'));
});

gulp.task('default', ['serve', 'browser-sync', 'watch']);
gulp.task('build', gulpSequence('jshint', 'compile', ['scripts', 'images']));
