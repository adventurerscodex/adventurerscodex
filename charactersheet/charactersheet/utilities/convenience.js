import marked from 'bin/textarea-markdown-editor/marked.min.js'

import { PersistenceService } from 'charactersheet/services/common'
import { AuthenticationToken } from 'charactersheet/models/common'

/**
 * This file contains a number of generic utility functions used throughout
 * Adventurer's Codex
 *
 * @author Brian Schrader
 * @author Nathaniel Arellano
 */

export var Utility = {
    markdown: {},
    string: {},
    array: {},
    oauth: {},
    jid: {}
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
 * Converts a shareable dropbox link to a direct image link.
 * `www.dropbox.com` will be converted to `dl.dropboxusercontent.com`
 * @param link: link to be converted
 *
 * @return direct link to dropbox image
 */
Utility.string.createDirectDropboxLink = function(link) {
    return link ? link.replace('www.dropbox.com', 'dl.dropboxusercontent.com') : '';
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
Utility.oauth.setXHRBearerHeader = function(xhr, accessToken) {
    if (!accessToken) {
        var token = PersistenceService.findAll(AuthenticationToken)[0];
        accessToken = token.accessToken();
    }

    if (!accessToken) {
        return;
    }
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
};

/**
 * Mimics $.getJSON, but includes OAuth Headers.
 * Leave accessToken argument blank to use the stored token value.
 */
Utility.oauth.getJSON = function(url, onsuccess, onerror, accessToken) {
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: onsuccess,
        error: onerror,
        beforeSend: function(xhr) {
            Utility.oauth.setXHRBearerHeader(xhr, accessToken);
        }
    });
};

Utility.oauth.postData = function(url, data, onsuccess, onerror, accessToken) {
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        dataType: 'text',
        success: onsuccess,
        error: onerror,
        beforeSend: function(xhr) {
            Utility.oauth.setXHRBearerHeader(xhr, accessToken);
        }
    });
};

Utility.oauth.putData = function(url, data, onsuccess, onerror, accessToken) {
    $.ajax({
        url: url,
        type: 'PUT',
        data: data,
        dataType: 'text',
        success: onsuccess,
        error: onerror,
        beforeSend: function(xhr) {
            Utility.oauth.setXHRBearerHeader(xhr, accessToken);
        }
    });
};



/* JID Methods */

/**
 * Remove characters from string that are not usable in an JID username.
 */
Utility.jid.sanitize = function(text) {
    return (text || '').replace(/[@"&'\/:<> ]/gm, '_');
};
