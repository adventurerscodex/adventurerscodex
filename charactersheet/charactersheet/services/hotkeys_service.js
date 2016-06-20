'use strict';
/*
 * A utility class that provides helpers for parsing
 * input keys and registers new [hotkey, function] combinations.
*/

var HotkeysService = {
    hotkeyHandler : function(data, event) {
        var keypressIsInBody = event.target.tagName.toLowerCase() !== 'input' &&
            event.target.tagName.toLowerCase() !== 'textarea';
        if(keypressIsInBody){
            var metaKey = HotkeysService._determineMetakey(event);

            var alphaNumericKey = String.fromCharCode(event.which);
            var cb = HotkeysService._callbackFromKeys(metaKey, alphaNumericKey);

            if(typeof cb === 'function'){
                cb();
            }
        }
        return true;
    },

    _hotkeys : {},

    _callbackFromKeys : function(metakey, alphaNumeric) {
        if(metakey){
            var key = metakey + ' ' + alphaNumeric;
            return HotkeysService._hotkeys[key];
        }
        else{
            return HotkeysService._hotkeys[alphaNumeric];
        }
    },

    registerHotkey : function(hotkey, callback){
        if(HotkeysService._hotkeys[hotkey]){
            throw('Existing hotkey: ' + hotkey);
        }
        if (callback){
            HotkeysService._hotkeys[hotkey] = callback;
        }
    },

    /**
     * Flush all registered hotkeys.
     */
    flushHotkeys : function() {
        HotkeysService._hotkeys = {};
    },

    _determineMetakey : function(event){
        if(event.ctrlKey){
            return 'ctrl';
        }
        else if(event.shiftKey){
            return 'shift';
        }
            else{
            return '';
        }
    }

};
