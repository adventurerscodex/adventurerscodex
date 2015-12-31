var stylus = require('stylus'),
    nib = require('nib'),
    nodes = stylus.nodes,
    utils = stylus.utils,
    path = require('path'),
    _ = require('lodash');

exports = module.exports = plugin;

exports.version = require(path.join(__dirname, '../package.json')).version;
exports.path = __dirname;

var OPTIONS = {
  SCALE_CENTER: 4,
  TYPOGRAPHIC_SCALE: [
    0.666, 0.75, 0.8333, 0.9167, 1,
    1.1667, 1.333, 1.5, 1.75, 2, 3, 4, 5, 6
  ]
};

function plugin(options) {

  options = options || {};
  _.defaults(options, OPTIONS);

  return function(style) {

    style.define('k-font-size-at-position', function(position) {
      position = position.val || 0;
      position = options.SCALE_CENTER + position;
      return options.TYPOGRAPHIC_SCALE[position];
    });

    style.use(nib());
    style.include('nib');
    style.include(__dirname);

  };

}
