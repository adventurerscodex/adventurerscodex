'use strict';

/**
 * This file contains a number of generic utility functions used throughout
 * Adventurer's Codex
 *
 * author: Brian Schrader
 */

var Utility = {
    markdown: {}
};


/* Markdown */

/**
 * Strip a markdown string of all markup.
 */
Utility.markdown.asPlaintext = function(myString) {
    var myString = myString || '';
    return marked(myString).replace(/<(?:.|\n)*?>/gm, '');
};
