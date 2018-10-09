import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { KOModel } from 'hypnos';
import ko from 'knockout';
import marked from 'bin/textarea-markdown-editor/marked.min';


export class Note extends KOModel {
    static __skeys__ = ['core', 'notes'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    title = ko.observable('');
    contents = ko.observable('');
    headline = ko.observable('');
    isSavedChatNotes = ko.observable(false);

    updateHeadline() {
        var text = '';
        try {
            text = this.contents();
        } catch(e) {
            // Ignore
        }
        var firstLine = text.split('\n')[0];
        if (firstLine.length > 35) {
            firstLine = this._getFirstWords(firstLine.substr(0, 35)) + '...';
        }
        this.headline(firstLine ? this._getPlaintext(firstLine) : 'Empty Note');
    }



    /* Private Methods */

    _getPlaintext = function(myString) {
        return marked(myString).replace(/<(?:.|\n)*?>/gm, '');
    };

    _getFirstWords = function(myString, nWords) {
        var words = myString.split(/\s+/);
        return words.slice(0, words.length - 2).join(' ');
    };
}