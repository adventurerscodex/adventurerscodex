import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { Fixtures } from 'charactersheet/utilities/fixtures';
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
    type = ko.observable('');

    updateHeadline() {
        var text = '';
        try {
            text = this.contents();
        } catch (e) {
            // Ignore
        }
        var firstLine = text.split('\n')[0];
        if (firstLine.length > 35) {
            firstLine = this._getFirstWords(firstLine.substr(0, 35)) + '...';
        }
        this.headline(firstLine ? this._getPlaintext(firstLine) : 'Empty Note');
    }

    /* Private Methods */

    _getPlaintext = function (myString) {
        return marked(myString).replace(/<(?:.|\n)*?>/gm, '');
    };

    _getFirstWords = function (myString, nWords) {
        var words = myString.split(/\s+/);
        return words.slice(0, words.length - 2).join(' ');
    };

    /**
     * Convenience method to append new content to the existing note.
     */
    appendTextToNote = (content) => {
        this.text(this.text() + '\n\n' + content);
    };

    static getSavedFromChatNote = async (coreUuid) => {
        const { objects: foundNotes } =
            await Note.ps.list({coreUuid, type: Fixtures.notes.type.chat});
        let chatNote = foundNotes[0];

        // if no chat note was found, create a new note and set its type to 'chat'
        // else, return the found chat note
        if (chatNote == undefined) {
            chatNote = new Note();
            chatNote.text('# Saved from Chat');
            chatNote.type(Fixtures.notes.type.chat);
        }

        return chatNote;
    };
}
