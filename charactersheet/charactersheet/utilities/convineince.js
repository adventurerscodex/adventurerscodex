'use strict';

/**
 * This file contains a number of generic utility functions used throughout
 * Adventurer's Codex
 *
 * @author Brian Schrader
 * @author Nathaniel Arellano
 */

var Utility = {
    markdown: {},
    string: {}
};


/* Markdown */

/**
 * Strip a markdown string of all markup.
 */
Utility.markdown.asPlaintext = function(markdown) {
    var myString = markdown || '';
    return marked(myString).replace(/<(?:.|\n)*?>/gm, '');
};

/* String Util */

/**
 * Decides wether the input string should be truncated and have ellipses
 * added to it.
 * 
 * @param value string to be modified
 * @param truncateAt is the length at which string will be truncated
 * 
 * @return plain text string that may or may not be truncated
 */

Utility.string.truncateStringAtLength = function(value, truncateAt) {
    var string = Utility.markdown.asPlaintext(value);
    if (string.length >= truncateAt) {
        return string.substring(0, truncateAt) + '...';
    } else {
        return string;
    }
};
