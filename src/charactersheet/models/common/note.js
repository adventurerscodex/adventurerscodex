import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { Fixtures, Notifications } from 'charactersheet/utilities';
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

    updateTitleFromHeadline () {
        if (!this.title() || this.title() === '') {
            let text = '';
            try {
                text = this.contents();
            } catch (e) {
              // Ignore
            }
            let firstLine = text.split('\n')[0];
            if (firstLine.length > 35) {
                firstLine = this._getFirstWords(firstLine.substr(0, 35)) + '...';
            }
            const title = firstLine ? this._getPlaintext(firstLine).replace(/(\r\n|\n|\r)/gm, '') : 'Empty Note';
            this.title(firstLine ? this._getPlaintext(firstLine).replace(/(\r\n|\n|\r)/gm, '') : 'Empty Note');
        }
    }

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
        this.contents(this.contents() + '\n\n' + content);
    };

    /**
     * Returns the note record that is has type=chat.
     */
    static getSavedFromChatNote = async (coreUuid) => {
        const { objects: foundNotes } = await Note.ps.list({
            coreUuid,
            type: Fixtures.notes.type.chat
        });
        let chatNote = foundNotes[0];

        // if no chat note was found, create a new note and set its type to 'chat'
        // else, return the found chat note
        if (chatNote == undefined) {
            chatNote = new Note();
            chatNote.coreUuid(coreUuid);
            chatNote.contents('# Saved from Chat');
            chatNote.type(Fixtures.notes.type.chat);
            const { object } = await chatNote.ps.create();
            chatNote = object;
        }

        return chatNote;
    };

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
        Notifications.note.added.dispatch(this);
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.note.changed.dispatch(this);
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.note.deleted.dispatch(this);
    }

    delete = async () => {
        await this.ps.delete();
    }

}
