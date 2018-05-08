import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { KOModel } from 'hypnos';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';
import marked from 'bin/textarea-markdown-editor/marked.min';


export class Note extends KOModel {
    static __skeys__ = ['core', 'notes'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    text = ko.observable('');
    isSavedChatNotes = ko.observable(false);

    headline = ko.pureComputed(function() {
        var text = this.text() || '';
        var firstLine = text.split('\n')[0];
        if (firstLine.length > 35) {
            firstLine = this._getFirstWords(firstLine.substr(0, 35)) + '...';
        }
        return firstLine ? this._getPlaintext(firstLine) : 'Empty Note';
    });

    /* Private Methods */

    _getPlaintext = function(myString) {
        return marked(myString).replace(/<(?:.|\n)*?>/gm, '');
    };

    _getFirstWords = function(myString, nWords) {
        var words = myString.split(/\s+/);
        return words.slice(0, words.length - 2).join(' ');
    };
}