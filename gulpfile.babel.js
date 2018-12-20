'use strict';

// Gulp module imports
import { src, dest, watch, parallel, series } from 'gulp';
import del from 'del';
import livereload from 'gulp-livereload';
import browserSync from 'browser-sync';
import sass from 'gulp-sass';
import minifycss from 'gulp-minify-css';
import jade from 'gulp-jade';
import gulpif from 'gulp-if';
import babel from 'gulp-babel';
import yargs from 'yargs';

const paths = {
  sass: {
    src: 'assets/scss/index.scss',
    dest: 'www/css',
    watch: 'assets/scss/**/*.scss'
  },
  js: {
    src: 'assets/js/index.js',
    dest: 'www/js',
    watch: 'assets/js/**/*.js'
  }
}

// Build Directories
// ----
const dirs = {
  src: 'assets',
  dest: 'build'
};

// File Sources
// ----
const sources = {
  styles: `${dirs.src}/scss/index.scss`,
  views: `${dirs.src}/**/*.jade`,
  scripts: `${dirs.src}/**/*.js`
};

// Recognise `--production` argument
const argv = yargs.argv;
const production = !!argv.production;

// Main Tasks

// Styles 
export const buildStyles = () => src(paths.sass.src)
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(gulpif(production, minifycss()))
  .pipe(dest(paths.sass.dest))
  .pipe(browserSync.stream());

// Views
export const buildViews = () => src(sources.views)
  .pipe(jade())
  .pipe(dest(dirs.dest))
  .pipe(livereload());

// Scripts
export const buildScripts = () => src(sources.scripts)
  .pipe(babel({ presets: ['es2015'] }))
  .pipe(dest(dirs.dest))
  .pipe(livereload());

// Clean
export const clean = () => del(['build']);

// Watch Task
export const devWatch = () => {
  browserSync.create()
  browserSync.init({
    server: "./www"
  });
  watch(paths.sass.watch, buildStyles);
  // watch(sources.views, buildViews);
  // watch(sources.scripts, buildScripts);
};


// Development Task
export const dev = series(clean, parallel(buildStyles), devWatch);

// Serve Task
export const build = series(clean, parallel(buildStyles));

// Default task
export default dev;