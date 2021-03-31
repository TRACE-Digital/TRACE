const gulp = require("gulp");
const gap = require("gulp-append-prepend");
const app = require('./package.json');

gulp.task('combine', async () => {

});

const TRACE_LICENSE = `
=========================================================
* TRACE - v${app.version}
=========================================================

* Copyright ${new Date().getFullYear()} ${app.author} (https://github.com/TRACE-Digital)
* Licensed under ${app.license}  (https://github.com/TRACE-Digital/TRACE/blob/master/LICENSE.md)

=========================================================
`;

const TIM_LICENSE = `
=========================================================
* Black Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================
`;

gulp.task("licenses", async function () {
  // this is to add Creative Tim licenses in the production mode for the minified js
  gulp
    .src("build/static/js/*chunk.js", { base: "./" })
    .pipe(
      gap.prependText(`/*!
${TRACE_LICENSE}
${TIM_LICENSE}
* The above copyright notices and this permission notice shall be included in all copies or substantial portions of the Software.

*/`)
    )
    .pipe(gulp.dest("./", { overwrite: true }));

  // this is to add Creative Tim licenses in the production mode for the minified html
  gulp
    .src("build/index.html", { base: "./" })
    .pipe(
      gap.prependText(`<!--
${TRACE_LICENSE}
${TIM_LICENSE}
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

-->`)
    )
    .pipe(gulp.dest("./", { overwrite: true }));

  // this is to add Creative Tim licenses in the production mode for the minified css
  gulp
    .src("build/static/css/*chunk.css", { base: "./" })
    .pipe(
      gap.prependText(`/*!
${TRACE_LICENSE}
${TIM_LICENSE}
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/`)
    )
    .pipe(gulp.dest("./", { overwrite: true }));
  return;
});
