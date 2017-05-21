'use strict';

function NotesViewModel() {
    var self = this;

    self.notes = ko.observableArray();
    self.selectedNote = ko.observable();

    self.load = function() {
        self.reloadData();

        Notifications.global.save.add(self.save);
        Notifications.notes.changed.add(self.reloadData);
    };

    self.unload = function() {
        self.save();
        Notifications.global.save.remove(self.save);
    };

    self.save = function() {
        self.notes().forEach(function(note, idx, _) {
            note.save();
        });
    };

    self.reloadData = function() {
        var key = CharacterManager.activeCharacter().key();
        var notes = PersistenceService.findBy(Note, 'characterId', key);
        if (notes.length > 0) {
            self.notes(notes);
        } else {
            self.addNote();
        }
        self.selectNote(self.notes()[0]);
    };

    /* UI Methods */

    self.addNote = function() {
        var key = CharacterManager.activeCharacter().key();
        var note = new Note();
        note.characterId(key);
        note.save();
        self.notes.push(note);
        self.selectNote(note);
    };

    self.deleteNote = function(note) {
        self.notes.remove(note);
        note.delete();
        self.selectNote(self.notes()[0]);
    };

    self.selectNote = function(note) {
        self.selectedNote(note);
    };

    self.isActiveCSS = function(note) {
        return self.selectedNote() === note ? 'active' : '';
    };
}
