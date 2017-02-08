[< Back to readme](https://github.com/angular-actioncable/angular-actioncable/blob/master/README.md)

## Contribute

 - before submitting a PR, make sure you successfully run: `npm run build`


## Setup Development (developed using Node v4.3.1)

 - `npm install -g gulp-cli`
 - `npm install -g karma-cli`
 - `npm install -g bower`
 - `npm install`
 - `bower install`

 - `npm run test_src` runs `gulp jshint` and `gulp test` on `src/*.js` files
 - `npm run build` runs jshint, tests `src/`, builds `dist/` and builds & tests dist and minimised dist

 - `apt-get install chromium-browser` is recommended for the browser requirements

#### other commands

 - `gulp jshint` runs jshint over the `/src` javascript files
 - `gulp build` builds package in `/dist` folder
 - `gulp watch` continuously runs `gulp build` on any change of the `/src` files

 - `gulp serve` runs `gulp test`, `gulp watch` and `gulp build`

 - `gulp test` run tests on `/src` files (must have {Chromium or Chrome} and Firefox installed locally)
 - `gulp test-dist` run tests on `/dist/angular-actioncable.js` files (must have {Chromium or Chrome} and Firefox installed locally)
 - `gulp test-min` run tests on `/dist/angular-actioncable.min.js` files (must have {Chromium or Chrome} and Firefox installed locally)

## Publish

 - update the changelog with the new version
 - `npm run build`
 - if tests pass then commit changes & push to master
 - change the version in `bower.json` and `package.json` and `README.md` (5 occurrences) and push a commit named `bump version` to `master` branch
 - tag a new release with the new version in github (bower will use this)
 - fetch upstream
 - publish to npm: fetch & pull master, `npm login`, `npm publish`

