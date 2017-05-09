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
    string: {},
    array: {},
    oauth: {}
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
 * @param value: string to be modified
 * @param truncateAt: is the length at which string will be truncated
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

/**
 * Updates a single element in an observable array.
 *
 * @param array: observable array that contains the item to be updated.
 * @param updatedElement: updated version of the original array element
 * @param elementId: PersistenceService ID of the element that has been updated
 *
 * @return void
 */
Utility.array.updateElement = function(array, updatedElement, elementId) {
    array.forEach(function(element, idx, _) {
        if (element.__id === elementId) {
            element.importValues(updatedElement.exportValues());
        }
    });
};

/* OAuth Request Shortcuts */

/**
 * Using the first Access Token in the local data store, set the
 * headers for an OAuth request.
 */
Utility.oauth.setXHRBearerHeader = function(xhr) {
    var key = CharacterManager.activeCharacter().key();
    var token = PersistenceService.findAll(AuthenticationToken)[0];
    if (!token) {
        throw Error('No token available for OAuth Requests.');
    }
    xhr.setRequestHeader('Authorization', 'Bearer ' + token.accessToken());
};

/**
 * Mimics $.getJSON, but includes OAuth Headers.
 */
Utility.oauth.getJSON = function(url, onsuccess, onerror) {
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: onsuccess,
        error: onerror,
        beforeSend: Utility.oauth.setXHRBearerHeader
    });
};