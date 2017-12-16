'use strict';

const path = require('path');
const webpackBuild = require('../../src/webpackBuild');
const fs = require('fs');
const Logger = require("../../utils/Logger");
const CWD = process.cwd();
const PACKAGE = require(path.join(CWD, 'package.json'));
const APP_BUILD_ENTRY = path.join(CWD, PACKAGE["react-scv"].appBuildEntry);
const middleware = require('../../src/middleware');

module.exports = (args, done) => {

  process.on('SIGINT', done);

  try {
    return buildApp().then(done);
  } catch (err) {
    Logger.error(err);
    done()
  }
};

function buildApp () {
  if (fs.existsSync(APP_BUILD_ENTRY)) {
    Logger.status('📦', 'building the app')
    const config = middleware.applyMiddleware(require.resolve('../../config/webpack.app'));
    return webpackBuild(config);
  } else {
    throw "There is no entry point of your application defined in your configuration (appBuildEntry). Check you package.json";
  }
}
