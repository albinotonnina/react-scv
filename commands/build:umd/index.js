"use strict";

const path = require("path");
const webpackBuild = require("../../src/webpackBuild");
const fs = require("fs");
const Logger = require("../../utils/Logger");
const CWD = process.cwd();
const PACKAGE = require(path.join(CWD, "package.json"));
const UMD_BUILD_ENTRY = path.join(CWD, PACKAGE["react-scv"].umdBuildEntry);
const middleware = require("../../src/middleware");


module.exports = (args, done) => {
  process.on("SIGINT", done);

  try {
    return buildUMD().then(done);
  } catch (err) {
    Logger.error(err);
    done()
  }
};

function buildUMD() {
  if (fs.existsSync(UMD_BUILD_ENTRY)) {
    Logger.status('📦', 'building the umd')
    const config = middleware.applyMiddleware(
      require.resolve("../../config/webpack.umd")
    );
    return webpackBuild(config);
  } else {
    throw "There is no entry point of your library defined in your configuration (umdBuildEntry). Check you package.json";
  }
}
