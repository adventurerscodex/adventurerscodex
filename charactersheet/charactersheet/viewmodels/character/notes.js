'use strict';

function NotesViewModel() {
    var self = this;

    self.note = ko.observable(new Note());

    self.init = function() {
        Notifications.global.save.add(function() {
            self.note().save();
        });
    };

    self.load = function() {
        var key = CharacterManager.activeCharacter().key();
        var note = Note.findBy(key);
        if (note.length > 0) {
            self.note(note[0]);
        } else {
            self.note(new Note());
        }
        self.note().characterId(key);

        //Subscriptions
        self.note().text.subscribe(self.note.save);
    };

    self.unload = function() {
        self.note().save();
    };
}
