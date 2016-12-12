'use strict';

function Note() {
    var self = this;
    self.ps = PersistenceService.register(Note, self);

    self.characterId = ko.observable(null);
    self.text = ko.observable('');

    self.headline = ko.pureComputed(function() {
        var text = self.text() || '';
        var firstLine = text.split('\n')[0];
        if (firstLine.length > 35) {
            firstLine = self._getFirstWords(firstLine.substr(0, 35)) + '...';
        }
        return firstLine ? self._getPlaintext(firstLine) : 'Empty Note';
    });

    self.clear = function() {
        self.text('');
        self.save();
    };

    self.importValues = function(values) {
        self.characterId(values.characterId);
        self.text(values.text);
    };

    self.exportValues = function() {
        return {
            characterId: self.characterId(),
            text: self.text()
        };
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
