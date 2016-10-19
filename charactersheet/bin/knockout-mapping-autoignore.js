'use strict';

/**
 * A Knockout Mapping addition that will automatically add any field not
 * included in the `include` list to the ignore list.
 * This eliminates the need to explicitly enter both includes and ignores.
 *
 * Usage:
 *
 *  function MyModel() {
 *   this.mapping = {
 *       include: ['name', 'address', 'zip code']
 *   });
 *   var fullMapping = ko.mapping.autoignore(this, this.mapping);
 *  }
 */
ko.mapping.autoignore = function(obj, config) {
    var includes = config.include || [];
    var keys = Object.keys(obj);

    config.ignore = config.ignore || [];
    config.ignore = config.ignore.concat(keys.filter(function(key, idx, _) {
        return includes.indexOf(key) === -1;
    }));
    return config;
};
