import ko from 'knockout';
import 'knockout-mapping';

import 'bin/knockout-mapping-autoignore';
import marked from 'bin/textarea-markdown-editor/marked.min.js';

import { PersistenceService } from 'charactersheet/services/common/persistence_service';

export function Note() {
    var self = this;
    self.ps = PersistenceService.register(Note, self);
    self.mapping = {
        include: ['characterId', 'text', 'isSavedChatNotes']
    };

    self.characterId = ko.observable(null);
    self.text = ko.observable('');
    self.isSavedChatNotes = ko.observable(false);

    self.headline = ko.pureComputed(function() {
        var text = self.text() || '';
        var firstLine = text.split('\n')[0];
        if (firstLine.length > 35) {
            firstLine = self._getFirstWords(firstLine.substr(0, 35)) + '...';
        }
        return firstLine ? self._getPlaintext(firstLine) : 'Empty Note';
    });

    self.clear = function() {
        var values = new Note().exportValues();
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.importValues = function(values) {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.exportValues = function() {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        return ko.mapping.toJS(self, mapping);
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };

    /* Private Methods */

    self._getPlaintext = function(myString) {
        return marked(myString).replace(/<(?:.|\n)*?>/gm, '');
    };

    self._getFirstWords = function(myString, nWords) {
        var words = myString.split(/\s+/);
        return words.slice(0, words.length - 2).join(' ');
    };
}


PersistenceService.addToRegistry(Note);
