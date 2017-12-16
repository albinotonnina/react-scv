const webpack = require('webpack');
const Logger = require('./../utils/Logger')

module.exports = function webpackBuild (config) {

  return new Promise((resolve, reject) => {

    webpack(config, (err, stats) => {
      if (err || stats.hasErrors()) {
        if (err) {
          Logger.error(err.stack || err);
          if (err.details) {
            Logger.error(err.details);
          }
        } else if (stats.hasErrors()) {
          Logger.log(stats.toString({colors: true}));
        }
        reject();
      } else {
        Logger.log(stats.toString({colors: true}));
        setTimeout(() => { //because apparently some webpack plugin might schedule some async work
          resolve();
        }, 0);
      }
    });

  });

}
