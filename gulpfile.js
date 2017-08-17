// @ts-check

var gulp = require('gulp');
var plumber = require('gulp-plumber'); // continue on error (i.e. 'watch')
var sequence = require('run-sequence'); // run things in sequence (i.e. not-parallel)

var del = require('del'); // delete files (clean)

var webpackConfig = require('./webpack.config.js');
var webpackStream = require('webpack-stream'); // packing!
var webpack = require('webpack');

let destBuild = 'docs';

gulp.task('clean', () => {
  return del([destBuild + '/**/*']);
});

gulp.task('assets', () => { // move assets
  return gulp.src('src/assets/**/*')
            .pipe(plumber())
            .pipe(gulp.dest(destBuild + '/assets'));
});

gulp.task('index', () => { // move root assets...
  return gulp.src('src/favicon.ico')
            .pipe(plumber())
            .pipe(gulp.dest(destBuild));
});

gulp.task('bundle', () => {
  return gulp.src('')
          .pipe(plumber()) //          development | production
          // @ts-ignore
          .pipe(webpackStream(webpackConfig('development'), webpack))
          .pipe(gulp.dest(destBuild));
});

gulp.task('bundle:prod', () => {
  return gulp.src('')
          .pipe(plumber()) //          development | production
          // @ts-ignore
          .pipe(webpackStream(webpackConfig('production'), webpack))
          .pipe(gulp.dest(destBuild));
});

gulp.task('build', (cb) => sequence('clean', ['index', 'assets', 'bundle'], cb));
gulp.task('build:prod', (cb) => sequence('clean', ['index', 'assets', 'bundle:prod'], cb));
