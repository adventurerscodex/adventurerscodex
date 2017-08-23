'use strict';

import { LZString } from 'lz-string'

/**
### JSON Item Specification

For an item to be dispatched automatically by the Services Layer it must contain
the following attributes. To accomplish this behavior, it's recommended to use
the JSON Payload convenience methods.


#### Compressed

This attribute tells the receiving Services Layer that the contents are
compressed and cannot be used in their current form.

Values are `true` and `false`.

__NOTE:__ If this attribute is present the item MUST also contain an attribute
detailing the kind of compression used by including a `compression` attribute.

__Example__

    <json route="pcard" compressed="true" compression="gzip">
        compressed json data
    </json>
*/
export var JSONPayload = {
    configuration: {
        compression: {
            'lz-string': {
                compress: function(string) {
                    return LZString.compressToUTF16(string);
                },
                decompress: function(data) {
                    return LZString.decompressFromUTF16(data);
                }
            }
        }
    },

    /**
     * Given an XML node, return the given message's JSON parsed contents.
     */
    getContents: function(node) {
        var isCompressed = node.attr('compressed').toLowerCase();

        var contents = null;
        if (isCompressed == 'true') {
            var compression = node.attr('compression').toLowerCase();
            contents = JSONPayload.configuration.compression[compression].decompress(node.text());
        } else {
            contents = node.text();
        }
        return JSON.parse(contents);
    },

    /**
     * Given an object to serialize and some configuration options, return a
     * <json></json> item element for use with XMPP.
     */
    getElement: function(obj, attrs) {
        var contents = JSON.stringify(obj);
        if (attrs.compressed) {
            contents = JSONPayload.configuration.compression[attrs.compression].compress(contents);
        }
        return $build('json', attrs).t(contents);
    }
};
